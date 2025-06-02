#!/bin/bash

# Exit on error
set -e

# Check platform
platform=$(uname)

if [[ "$platform" == "Darwin" ]]; then
    echo "Running on macOS. Note that the AppImage created will only work on Linux systems."
    if ! command -v docker &> /dev/null; then
        echo "Docker Desktop for Mac is not installed. Please install it from https://www.docker.com/products/docker-desktop"
        exit 1
    fi
elif [[ "$platform" == "Linux" ]]; then
    echo "Running on Linux. Proceeding with AppImage creation..."
else
    echo "This script is intended to run on macOS or Linux. Current platform: $platform"
    exit 1
fi

# Enable BuildKit
export DOCKER_BUILDKIT=1

BUILD_IMAGE_NAME="cognidream-appimage-builder"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Check and install Buildx if needed
if ! docker buildx version >/dev/null 2>&1; then
    echo "Installing Docker Buildx..."
    mkdir -p ~/.docker/cli-plugins/
    curl -SL https://github.com/docker/buildx/releases/download/v0.13.1/buildx-v0.13.1.linux-amd64 -o ~/.docker/cli-plugins/docker-buildx
    chmod +x ~/.docker/cli-plugins/docker-buildx
fi

# Download appimagetool if not present
if [ ! -f "appimagetool" ]; then
    echo "Downloading appimagetool..."
    wget -O appimagetool "https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage"
    chmod +x appimagetool
fi

# Delete any existing AppImage to acognidream bloating the build
rm -f cognidream-x86_64.AppImage

# Create build Dockerfile
echo "Creating build Dockerfile..."
cat > Dockerfile.build << 'EOF'
# syntax=docker/dockerfile:1
FROM ubuntu:20.04

# Install required dependencies
RUN apt-get update && apt-get install -y \
    libfuse2 \
    libglib2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxss1 \
    libxtst6 \
    libnss3 \
    libasound2 \
    libdrm2 \
    libgbm1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
EOF

# Create .dockerignore file
echo "Creating .dockerignore file..."
cat > .dockerignore << EOF
Dockerfile.build
.dockerignore
.git
.gitignore
.DS_Store
*~
*.swp
*.swo
*.tmp
*.bak
*.log
*.err
node_modules/
venv/
*.egg-info/
*.tox/
dist/
EOF

# Build Docker image without cache
echo "Building Docker image (no cache)..."
docker build --no-cache -t "$BUILD_IMAGE_NAME" -f Dockerfile.build .

# Create AppImage using local appimagetool
echo "Creating AppImage..."
docker run --rm --privileged -v "$(pwd):/app" "$BUILD_IMAGE_NAME" bash -c '
cd /app && \
rm -rf cognidreamApp.AppDir && \
mkdir -p cognidreamApp.AppDir/usr/bin cognidreamApp.AppDir/usr/lib cognidreamApp.AppDir/usr/share/applications && \
find . -maxdepth 1 ! -name cognidreamApp.AppDir ! -name "." ! -name ".." -exec cp -r {} cognidreamApp.AppDir/usr/bin/ \; && \
cp cognidream.png cognidreamApp.AppDir/ && \
echo "[Desktop Entry]" > cognidreamApp.AppDir/cognidream.desktop && \
echo "Name=cognidream" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Comment=Open source AI code editor." >> cognidreamApp.AppDir/cognidream.desktop && \
echo "GenericName=Text Editor" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Exec=cognidream %F" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Icon=cognidream" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Type=Application" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "StartupNotify=false" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "StartupWMClass=cognidream" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Categories=TextEditor;Development;IDE;" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "MimeType=application/x-cognidream-workspace;" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Keywords=cognidream;" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Actions=new-empty-window;" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "[Desktop Action new-empty-window]" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Name=New Empty Window" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Name[de]=Neues leeres Fenster" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Name[es]=Nueva ventana vacía" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Name[fr]=Nouvelle fenêtre vide" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Name[it]=Nuova finestra vuota" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Name[ja]=新しい空のウィンドウ" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Name[ko]=새 빈 창" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Name[ru]=Новое пустое окно" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Name[zh_CN]=新建空窗口" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Name[zh_TW]=開新空視窗" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Exec=cognidream --new-window %F" >> cognidreamApp.AppDir/cognidream.desktop && \
echo "Icon=cognidream" >> cognidreamApp.AppDir/cognidream.desktop && \
chmod +x cognidreamApp.AppDir/cognidream.desktop && \
cp cognidreamApp.AppDir/cognidream.desktop cognidreamApp.AppDir/usr/share/applications/ && \
echo "[Desktop Entry]" > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
echo "Name=cognidream - URL Handler" > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
echo "Comment=Open source AI code editor." > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
echo "GenericName=Text Editor" > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
echo "Exec=cognidream --open-url %U" > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
echo "Icon=cognidream" > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
echo "Type=Application" > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
echo "NoDisplay=true" > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
echo "StartupNotify=true" > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
echo "Categories=Utility;TextEditor;Development;IDE;" > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
echo "MimeType=x-scheme-handler/cognidream;" > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
echo "Keywords=cognidream;" > cognidreamApp.AppDir/cognidream-url-handler.desktop && \
chmod +x cognidreamApp.AppDir/cognidream-url-handler.desktop && \
cp cognidreamApp.AppDir/cognidream-url-handler.desktop cognidreamApp.AppDir/usr/share/applications/ && \
echo "#!/bin/bash" > cognidreamApp.AppDir/AppRun && \
echo "HERE=\$(dirname \"\$(readlink -f \"\${0}\")\")" >> cognidreamApp.AppDir/AppRun && \
echo "export PATH=\${HERE}/usr/bin:\${PATH}" >> cognidreamApp.AppDir/AppRun && \
echo "export LD_LIBRARY_PATH=\${HERE}/usr/lib:\${LD_LIBRARY_PATH}" >> cognidreamApp.AppDir/AppRun && \
echo "exec \${HERE}/usr/bin/cognidream --no-sandbox \"\$@\"" >> cognidreamApp.AppDir/AppRun && \
chmod +x cognidreamApp.AppDir/AppRun && \
chmod -R 755 cognidreamApp.AppDir && \

# Strip unneeded symbols from the binary to reduce size
strip --strip-unneeded cognidreamApp.AppDir/usr/bin/cognidream

ls -la cognidreamApp.AppDir/ && \
ARCH=x86_64 ./appimagetool -n cognidreamApp.AppDir cognidream-x86_64.AppImage
'

# Clean up
rm -rf cognidreamApp.AppDir .dockerignore appimagetool

echo "AppImage creation complete! Your AppImage is: cognidream-x86_64.AppImage"
