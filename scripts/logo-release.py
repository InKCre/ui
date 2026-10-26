#!/usr/bin/env python3
"""Package committed logo resources; extend the existing npm release without rendering."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
REPOSITORY = 'InKCre/ui'


def run(*args):
    return subprocess.check_output(args, cwd=ROOT).decode().strip()


def inventory(read):
    manifest = json.loads(read('manifest.json'))
    records = manifest['assets'] + manifest['supporting_files']
    names = [r['path'] for r in records] + ['manifest.json']
    if len(set(names)) != len(names):
        raise ValueError('Duplicate logo paths')
    for record in records:
        name = record['path']
        if name.startswith('/') or '..' in name.split('/'):
            raise ValueError(f'Invalid logo path: {name}')
        data = read(name)
        if len(data) != record['bytes'] or hashlib.sha256(data).hexdigest() != record['sha256']:
            raise ValueError(f'Logo inventory mismatch: {name}')
    return sorted(names)


def archive(read, version):
    if not re.fullmatch(r'(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)', version):
        raise ValueError(f'Expected stable UI version, got {version}')
    output = io.BytesIO()
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_STORED) as package:
        for name in inventory(read):
            info = zipfile.ZipInfo(f'InKCre-logo-pack-{version}/{name}', (1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            package.writestr(info, read(name))
    return output.getvalue()


def verify_archive(data, read, version):
    prefix = f'InKCre-logo-pack-{version}/'
    with zipfile.ZipFile(io.BytesIO(data)) as package:
        expected = [prefix + name for name in inventory(read)]
        if sorted(package.namelist()) != expected:
            raise ValueError('Logo ZIP inventory mismatch')
        for name in expected:
            if package.read(name) != read(name[len(prefix):]):
                raise ValueError(f'Logo ZIP file mismatch: {name}')


def require_matching_tag(actual, expected):
    if actual is not None and actual != expected:
        raise ValueError('Swift version tag points to a different commit')


def require_matching_asset(actual, expected):
    if actual != expected:
        raise ValueError('Existing Logo ZIP differs; published assets cannot be overwritten')


def github(route):
    result = subprocess.run(['gh', 'api', f'repos/{REPOSITORY}/{route}'], cwd=ROOT,
                            capture_output=True, text=True)
    if result.returncode:
        if '(HTTP 404)' in result.stderr:
            return None
        raise RuntimeError(result.stderr)
    return json.loads(result.stdout)


def publish(version):
    npm_tag = f'@inkcre/ui-web@{version}'
    result = subprocess.run(['git', 'rev-parse', '--verify', f'refs/tags/{npm_tag}^{{commit}}'],
                            cwd=ROOT, capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(f'Missing npm release tag {npm_tag}; verify the published npm commit and restore its tag before retrying. Do not tag the current HEAD by guesswork.')
    commit = result.stdout.strip()
    manifest = subprocess.run(['git', 'cat-file', '-e', f'{commit}:Package.swift'], cwd=ROOT,
                              capture_output=True)
    if manifest.returncode:
        print('Historical UI release has no Swift package; skip.')
        return

    def read(name):
        return subprocess.check_output(['git', 'show', f'{commit}:assets/logo/{name}'], cwd=ROOT)

    data = archive(read, version)
    verify_archive(data, read, version)
    refs = run('git', 'ls-remote', '--tags', 'origin', f'refs/tags/{version}', f'refs/tags/{version}^{{}}')
    tags = dict(line.split()[::-1] for line in refs.splitlines())
    actual = tags.get(f'refs/tags/{version}^{{}}', tags.get(f'refs/tags/{version}'))
    require_matching_tag(actual, commit)
    if actual is None:
        # Push the anchored commit directly; no local tag state is needed on retries.
        run('git', 'push', 'origin', f'{commit}:refs/tags/{version}')
    release = github(f'releases/tags/{npm_tag}')
    if release is None:
        run('gh', 'release', 'create', npm_tag, '--repo', REPOSITORY, '--verify-tag',
            '--title', npm_tag, '--notes', 'UI 发行；Logo 资产与 npm、SwiftPM 使用同一提交。')
        release = github(f'releases/tags/{npm_tag}')
    name = f'InKCre-logo-pack-{version}.zip'
    existing = next((a for a in release['assets'] if a['name'] == name), None)
    with tempfile.TemporaryDirectory(prefix='inkcre-logo-release-') as temporary:
        destination = Path(temporary) / name
        if existing:
            run('gh', 'release', 'download', npm_tag, '--repo', REPOSITORY,
                '--pattern', name, '--dir', temporary)
            require_matching_asset(destination.read_bytes(), data)
        else:
            destination.write_bytes(data)
            run('gh', 'release', 'upload', npm_tag, str(destination), '--repo', REPOSITORY)
    print(f'Logo channels complete: {version} at {commit}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['pack', 'publish'])
    args = parser.parse_args()
    version = json.loads((ROOT/'packages/web/package.json').read_text())['version']
    if args.command == 'publish':
        publish(version)
        return
    read = lambda name: (ROOT/'assets/logo'/name).read_bytes()
    data = archive(read, version)
    verify_archive(data, read, version)
    destination = ROOT/'dist/logo'/f'InKCre-logo-pack-{version}.zip'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(data)
    print(destination)


if __name__ == '__main__':
    main()
