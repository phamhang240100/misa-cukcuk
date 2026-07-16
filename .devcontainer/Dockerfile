FROM node:24

ARG TZ
ENV TZ="$TZ"

ARG CLAUDE_CODE_VERSION=latest

# Install basic development tools
RUN apt-get update && apt-get install -y --no-install-recommends \
  less \
  git \
  procps \
  sudo \
  fzf \
  zsh \
  man-db \
  unzip \
  gnupg2 \
  gh \
  iptables \
  ipset \
  iproute2 \
  dnsutils \
  aggregate \
  jq \
  nano \
  vim \
  lsof \
  postgresql-client \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y tzdata

ENV TZ=Asia/Ho_Chi_Minh

# Ensure default node user has access to /usr/local/share
RUN mkdir -p /usr/local/share/npm-global && \
  chown -R node:node /usr/local/share

ARG USERNAME=node

# Persist bash history.
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  && mkdir /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R $USERNAME /commandhistory

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Create workspace and config directories and set permissions
RUN mkdir -p /workspace /home/node/.claude /home/node/.local/share/opencode /home/node/.claude-api && \
  chown -R node:node /workspace /home/node/.claude /home/node/.local /home/node/.claude-api

WORKDIR /workspace

ARG GIT_DELTA_VERSION=0.18.2
RUN ARCH=$(dpkg --print-architecture) && \
  wget "https://github.com/dandavison/delta/releases/download/${GIT_DELTA_VERSION}/git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  sudo dpkg -i "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  rm "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb"

# Set up non-root user
USER node

# Fix SSH permissions for mounted .ssh directory
RUN mkdir -p /home/node/.ssh /home/node/.local/share/opencode /home/node/.claude-api && \
  echo 'if [ -d ~/.ssh ]; then chmod 700 ~/.ssh 2>/dev/null || true; chmod 600 ~/.ssh/* 2>/dev/null || true; fi' >> /home/node/.zshrc && \
  echo 'if [ -d ~/.ssh ]; then chmod 700 ~/.ssh 2>/dev/null || true; chmod 600 ~/.ssh/* 2>/dev/null || true; fi' >> /home/node/.bashrc && \
  echo 'if [ -d ~/.local/share/opencode ]; then chmod 700 ~/.local/share/opencode 2>/dev/null || true; fi' >> /home/node/.zshrc && \
  echo 'if [ -d ~/.local/share/opencode ]; then chmod 700 ~/.local/share/opencode 2>/dev/null || true; fi' >> /home/node/.bashrc && \
  echo 'if [ -d ~/.claude-api ]; then chmod 700 ~/.claude-api 2>/dev/null || true; fi' >> /home/node/.zshrc && \
  echo 'if [ -d ~/.claude-api ]; then chmod 700 ~/.claude-api 2>/dev/null || true; fi' >> /home/node/.bashrc

# Install global packages
ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$PATH:/usr/local/share/npm-global/bin

# Set the default shell to zsh rather than sh
ENV SHELL=/bin/zsh

# Set the default editor and visual
ENV EDITOR=nano
ENV VISUAL=nano

# Default powerline10k theme
ARG ZSH_IN_DOCKER_VERSION=1.2.0
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v${ZSH_IN_DOCKER_VERSION}/zsh-in-docker.sh)" -- \
  -p git \
  -p fzf \
  -p zsh-autosuggestions \
  -a "source /usr/share/doc/fzf/examples/key-bindings.zsh" \
  -a "source /usr/share/doc/fzf/examples/completion.zsh" \
  -a "export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  -x

# Install Claude
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash && \
  echo 'export BUN_INSTALL="$HOME/.bun"' >> /home/node/.zshrc && \
  echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> /home/node/.zshrc && \
  echo 'export BUN_INSTALL="$HOME/.bun"' >> /home/node/.bashrc && \
  echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> /home/node/.bashrc

# Install OpenCode CLI for Linux ARM64
RUN mkdir -p /tmp/opencode && \
  curl -fsSL https://github.com/anomalyco/opencode/releases/latest/download/opencode-linux-arm64.tar.gz -o /tmp/opencode/opencode.tar.gz && \
  tar -xzf /tmp/opencode/opencode.tar.gz -C /tmp/opencode && \
  mkdir -p /home/node/.local/bin && \
  mv /tmp/opencode/opencode /home/node/.local/bin/ && \
  chmod +x /home/node/.local/bin/opencode && \
  chown -R node:node /home/node/.local && \
  rm -rf /tmp/opencode && \
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> /home/node/.zshrc && \
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> /home/node/.bashrc

# Copy and set up firewall script
COPY init-firewall.sh /usr/local/bin/
USER root
RUN chmod +x /usr/local/bin/init-firewall.sh && \
  echo "node ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh" > /etc/sudoers.d/node-firewall && \
  chmod 0440 /etc/sudoers.d/node-firewall
USER node
