// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "InKCreUI",
    products: [.library(name: "InKCreLogoAssets", targets: ["InKCreLogoAssets"])],
    targets: [
        .target(
            name: "InKCreLogoAssets",
            path: "assets/logo",
            exclude: [
                "masters", "svg", "sources", "build_pack.py", "manifest.json",
                "PROVENANCE.json", "QA-report.json", "README.zh-CN.md",
                "InKCre-logo-pack-preview.png",
            ],
            sources: ["InKCreLogoAssets.swift"],
            resources: [.copy("png")]
        )
    ]
)
