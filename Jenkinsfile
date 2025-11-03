pipeline {
    agent { label 'build-agent' }
    stages {
        stage('Build') {
            steps {
                sh './build.sh'
            }
        }
        stage('Test') {
            steps {
                sh './run-tests.sh'
            }
        }
        stage('Package') {
            steps {
                sh './bundle.sh'
            }
        }
        stage('Deploy') {
            steps {
                sshagent(['cloud-server-ssh']) {
                    sh 'ssh user@cloud-server "cd /app && git pull && systemctl restart app"'
                }
            }
        }
    }
}
