import hashlib
import sys
sys.dont_write_bytecode = True
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import subprocess
import zipfile


def load(path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


root = Path(__file__).resolve().parents[1]
release = load(root/'scripts/logo-release.py')
generator = load(root/'assets/logo/build_pack.py')


class LogoContracts(unittest.TestCase):
    def test_svg_edits_are_generation_inputs_and_not_overwritten(self):
        previous = generator.ROOT
        with tempfile.TemporaryDirectory() as directory:
            generator.ROOT = Path(directory)
            try:
                for name in generator.SOURCE_FILES.values():
                    path = generator.ROOT/name
                    path.parent.mkdir(parents=True, exist_ok=True)
                    source = (previous/name).read_text().replace('#808080', '#707070')
                    path.write_text(source)
                    result = generator.svg('original-transparent', 32 if 'optical' in name else 256)
                    self.assertIn('#707070', result)
                    self.assertEqual(path.read_text(), source)
                self.assertIn('#FFFFFF', generator.svg('reverse-transparent', 32))
                self.assertIn('#707070', generator.svg('reverse-transparent', 32))
                self.assertNotIn('#707070', generator.svg('black-transparent', 32))
            finally:
                generator.ROOT = previous

    def test_zip_preserves_file_boundaries_and_retries_are_identical(self):
        files = {'a': b'AB', 'b': b'CD'}
        records = [{'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
                   for name, data in files.items()]
        files['manifest.json'] = json.dumps({'assets': records, 'supporting_files': []}).encode()
        read = files.__getitem__
        data = release.archive(read, '2.6.0')
        self.assertEqual(data, release.archive(read, '2.6.0'))
        release.verify_archive(data, read, '2.6.0')
        corrupt = io.BytesIO()
        with zipfile.ZipFile(corrupt, 'w') as archive:
            for name, value in {**files, 'a': b'A', 'b': b'BCD'}.items():
                archive.writestr('InKCre-logo-pack-2.6.0/'+name, value)
        with self.assertRaisesRegex(ValueError, 'file mismatch'):
            release.verify_archive(corrupt.getvalue(), read, '2.6.0')

    def test_npm_already_published_repairs_channels_and_rejects_conflicts(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)/'repo'
            repo.mkdir()
            remote = Path(directory)/'remote.git'
            subprocess.run(['git', 'init', '--bare', '-q', str(remote)], check=True)
            subprocess.run(['git', 'init', '-q', str(repo)], check=True)
            original_run = release.run
            saved = {'release': None, 'data': None, 'uploads': 0}
            with patch.object(release, 'ROOT', repo):
                original_run('git', 'remote', 'add', 'origin', str(remote))
                (repo/'Package.swift').write_text('// candidate resource package')
                assets = repo/'assets/logo'
                assets.mkdir(parents=True)
                content = b'logo'
                (assets/'mark').write_bytes(content)
                (assets/'manifest.json').write_text(json.dumps({
                    'assets': [{'path': 'mark', 'bytes': 4, 'sha256': hashlib.sha256(content).hexdigest()}],
                    'supporting_files': []}))
                original_run('git', 'add', '.')
                original_run('git', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
                             'commit', '-qm', 'released resources')
                commit = original_run('git', 'rev-parse', 'HEAD')
                with self.assertRaisesRegex(RuntimeError, 'npm release tag'):
                    release.publish('2.6.0')
                original_run('git', 'tag', '@inkcre/ui-web@2.6.0')
                # A later main commit must never leak into the released ZIP or Swift tag.
                (assets/'mark').write_bytes(b'future')
                original_run('git', 'add', '.')
                original_run('git', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
                             'commit', '-qm', 'future resources')

                def command(*args):
                    if args[0] != 'gh':
                        return original_run(*args)
                    if args[2] == 'create':
                        saved['release'] = {'assets': []}
                    elif args[2] == 'upload':
                        saved['data'] = Path(args[4]).read_bytes()
                        saved['uploads'] += 1
                        saved['release']['assets'] = [{'name': 'InKCre-logo-pack-2.6.0.zip'}]
                    elif args[2] == 'download':
                        (Path(args[-1])/'InKCre-logo-pack-2.6.0.zip').write_bytes(saved['data'])
                    else:
                        raise AssertionError(args)
                    return ''

                with patch.object(release, 'run', command), patch.object(
                        release, 'github', lambda route: saved['release']):
                    release.publish('2.6.0')
                    self.assertIn(commit, original_run('git', 'ls-remote', '--tags', 'origin', 'refs/tags/2.6.0'))
                    release.publish('2.6.0')
                    self.assertEqual(saved['uploads'], 1)
                    saved['data'] = b'conflict'
                    with self.assertRaisesRegex(ValueError, 'cannot be overwritten'):
                        release.publish('2.6.0')
                    original_run('git', 'push', '--force', 'origin', 'HEAD:refs/tags/2.6.0')
                    with self.assertRaisesRegex(ValueError, 'different commit'):
                        release.publish('2.6.0')


if __name__ == '__main__':
    unittest.main()
