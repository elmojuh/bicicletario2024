pipeline {
    agent {
        dockerContainer {
            image 'node:latest'
        }
    }
    stages {
        stage('Clone') {
            steps {
                sh 'git clone https://github.com/elmojuh/bicicletario2024.git'
                dir('bicicletario2024') {
                    // Os próximos estágios devem ser colocados aqui
                }
            }
        }
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
