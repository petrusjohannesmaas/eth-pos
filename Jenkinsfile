pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from repository...'
                echo 'Source code checkout complete!'
            }
        }
        
        stage('Build') {
            steps {
                echo 'Starting build process...'
                echo 'Compiling application...'
                echo 'Build completed successfully!'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running test suite...'
                echo 'Executing unit tests...'
                echo 'Executing integration tests...'
                echo 'All tests passed!'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Starting deployment process...'
                echo 'Deploying to target environment...'
                echo 'Deployment completed successfully!'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully! CI Server is working properly.'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
