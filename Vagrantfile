Vagrant.configure("2") do |config|
  # Use Ubuntu 22.04 LTS (Jammy Jellyfish)
  config.vm.box = "ubuntu/jammy64"
  
  # Configure VM resources - keeping it light
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
    vb.cpus = 1
  end
  
  # Provision the VM with Docker and git
  config.vm.provision "shell", inline: <<-SHELL
    # Update package lists
    apt-get update
    
    # Install git
    apt-get install -y git
    
    # Install Docker
    # Add Docker's official GPG key
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    # Add Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Add vagrant user to docker group so you don't need sudo
    usermod -aG docker vagrant
    
    # Verify installations
    echo "=== Git version ==="
    git --version
    echo "=== Docker version ==="
    docker --version
    echo "=== Setup complete! ==="
  SHELL
end
