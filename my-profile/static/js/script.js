// ============================================
// HEMANTH'S PORTFOLIO - COMPLETE INTERACTIVE FEATURES
// WITH ALL FIXES - CLOUD ARCH & TECH RADAR INFO PANEL
// ============================================

// DOM Elements
const voiceToggle = document.getElementById('voiceToggle');
const themeToggle = document.getElementById('themeToggle');
const terminalToggle = document.getElementById('terminalToggle');
const terminalModal = document.getElementById('terminalModal');
const closeTerminal = document.querySelector('.close-terminal');
const quickTerminal = document.getElementById('quickTerminal');
const voiceNotification = document.getElementById('voiceNotification');
const closeVoiceNote = document.getElementById('closeVoiceNote');
const body = document.body;

// Typing Animation Elements
const typedTextElement = document.getElementById('typed-text');

// Voice Recognition
let isListening = false;
let recognition;

// Terminal Game Variables
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const commandHistory = document.getElementById('commandHistory');

// Cloud Architecture Visualizer - UPDATED
const cloudServices = document.querySelectorAll('.cloud-service');
const serviceName = document.getElementById('serviceName');
const serviceDesc = document.getElementById('serviceDesc');
const serviceStatus = document.getElementById('serviceStatus');
const containerCount = document.getElementById('containerCount');
const uptime = document.getElementById('uptime');
const load = document.getElementById('load');
const showMicroservices = document.getElementById('showMicroservices');
const showMonolithic = document.getElementById('showMonolithic');
const resetArchitecture = document.getElementById('resetArchitecture');

// Tech Radar - NEW INFO PANEL
const radarPoints = document.querySelectorAll('.radar-point');
const radarBtns = document.querySelectorAll('.radar-btn');
const techSkillName = document.getElementById('techSkillName');
const techSkillLevel = document.getElementById('techSkillLevel');
const techSkillExp = document.getElementById('techSkillExp');
const techSkillDesc = document.getElementById('techSkillDesc');
const techSkillProjects = document.getElementById('techSkillProjects');
const techRadarInfoPanel = document.getElementById('techRadarInfoPanel');

// Code Snippets
const snippetTabs = document.querySelectorAll('.snippet-tab');
const copyButtons = document.querySelectorAll('.copy-code');

// Voice Commands List
const voiceCommands = {
    'dark mode': toggleTheme,
    'light mode': toggleTheme,
    'switch theme': toggleTheme,
    'show about': () => scrollToSection('about'),
    'show projects': () => scrollToSection('projects'),
    'show skills': () => scrollToSection('skills'),
    'show certifications': () => scrollToSection('certifications'),
    'show contact': () => scrollToSection('contact'),
    'go home': () => scrollToSection('home'),
    'open terminal': openTerminal,
    'close terminal': closeTerminalModal,
    'start voice': startVoiceRecognition,
    'stop voice': stopVoiceRecognition,
    'help': showVoiceHelp
};

// ====================
// TYPING ANIMATION
// ====================
function initTypingAnimation() {
    const texts = [
        'Cloud Engineer',
        'DevOps Enthusiast',
        'Microservices Architect',
        'Containerization Expert',
        'CI/CD Specialist'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
}

// ====================
// THEME MANAGEMENT
// ====================
function toggleTheme() {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    
    const isDark = body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    if (isDark) {
        speak("Switched to dark mode");
    } else {
        speak("Switched to light mode");
    }
}

// ====================
// VOICE CONTROL SYSTEM
// ====================
function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            isListening = true;
            voiceToggle.classList.add('listening');
            voiceToggle.querySelector('.voice-status').textContent = 'Listening...';
        };
        
        recognition.onresult = function(event) {
            const command = event.results[0][0].transcript.toLowerCase();
            handleVoiceCommand(command);
        };
        
        recognition.onend = function() {
            isListening = false;
            voiceToggle.classList.remove('listening');
            voiceToggle.querySelector('.voice-status').textContent = '';
        };
        
        recognition.onerror = function(event) {
            console.log('Voice recognition error:', event.error);
            isListening = false;
            voiceToggle.classList.remove('listening');
        };
    } else {
        console.log('Speech recognition not supported');
        voiceToggle.style.display = 'none';
    }
}

function startVoiceRecognition() {
    if (recognition && !isListening) {
        recognition.start();
        speak("Listening for commands");
    }
}

function stopVoiceRecognition() {
    if (recognition && isListening) {
        recognition.stop();
        speak("Voice recognition stopped");
    }
}

function handleVoiceCommand(command) {
    console.log('Voice command:', command);
    
    const feedback = document.createElement('div');
    feedback.className = 'voice-feedback';
    feedback.textContent = `Heard: "${command}"`;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
    
    let matched = false;
    for (const [key, action] of Object.entries(voiceCommands)) {
        if (command.includes(key)) {
            action();
            matched = true;
            break;
        }
    }
    
    if (!matched) {
        speak("Sorry, I didn't understand that command. Try saying 'help' for available commands.");
    }
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        speechSynthesis.speak(utterance);
    }
}

function showVoiceHelp() {
    const helpText = "Available commands: dark mode, light mode, show about, show projects, show skills, show certifications, show contact, open terminal, close terminal, start voice, stop voice";
    speak(helpText);
    
    alert("Voice Commands:\n\n" +
        "• 'dark mode' / 'light mode' - Switch themes\n" +
        "• 'show about' - Scroll to about section\n" +
        "• 'show projects' - Scroll to projects\n" +
        "• 'show skills' - Scroll to skills\n" +
        "• 'show certifications' - Scroll to certifications\n" +
        "• 'show contact' - Scroll to contact\n" +
        "• 'open terminal' / 'close terminal' - Terminal game\n" +
        "• 'start voice' / 'stop voice' - Voice control");
}

// ====================
// TERMINAL GAME
// ====================
function openTerminal() {
    terminalModal.style.display = 'flex';
    terminalInput.focus();
}

function closeTerminalModal() {
    terminalModal.style.display = 'none';
}

function handleTerminalCommand(command) {
    const output = document.createElement('div');
    output.className = 'terminal-line';
    
    const historyLine = document.createElement('div');
    historyLine.className = 'terminal-line';
    historyLine.textContent = `$ ${command}`;
    terminalOutput.insertBefore(historyLine, terminalOutput.lastElementChild);
    
    command = command.toLowerCase().trim();
    
    switch(command) {
        case 'help':
            output.innerHTML = `<span class="output">Available commands:</span><br>
                               • <span class="accent">help</span> - Show this help<br>
                               • <span class="accent">whoami</span> - About me<br>
                               • <span class="accent">about</span> - About section<br>
                               • <span class="accent">projects</span> - List my projects<br>
                               • <span class="accent">skills</span> - Show tech skills<br>
                               • <span class="accent">clear</span> - Clear terminal<br>
                               • <span class="accent">ls</span> - List directory<br>
                               • <span class="accent">pwd</span> - Current directory<br>
                               • <span class="accent">echo [text]</span> - Echo text<br>
                               • <span class="accent">date</span> - Current date<br>
                               • <span class="accent">theme</span> - Toggle dark/light mode`;
            break;
            
        case 'whoami':
            output.innerHTML = `<span class="output">Hemanth Issai</span><br>
                               <span class="output">CSE Student | Cloud & DevOps Engineer</span><br>
                               <span class="output">Specializing in Microservices, Docker, CI/CD</span>`;
            break;
            
        case 'about':
            output.innerHTML = `<span class="output">About Me:</span><br>
                               <span class="output">Cloud & DevOps Engineer passionate about building scalable infrastructure.</span><br>
                               <span class="output">Currently pursuing B.Tech in CSE at LPU.</span><br>
                               <span class="output">Expertise in Docker, Microservices, CI/CD pipelines.</span>`;
            scrollToSection('about');
            break;
            
        case 'projects':
            output.innerHTML = `<span class="output">My Projects:</span><br>
                               • <span class="accent">cars-database-microservices</span> - Dockerized microservices<br>
                               • <span class="accent">car-database</span> - DevOps project with Git workflow<br>
                               • <span class="accent">monolithic-car-project</span> - Dockerized monolithic app`;
            scrollToSection('projects');
            break;
            
        case 'skills':
            output.innerHTML = `<span class="output">Technical Skills:</span><br>
                               • <span class="accent">Cloud:</span> Docker, AWS, CI/CD<br>
                               • <span class="accent">DevOps:</span> Git, Jenkins, Terraform<br>
                               • <span class="accent">Languages:</span> Python, JavaScript, Java<br>
                               • <span class="accent">Databases:</span> MongoDB, PostgreSQL`;
            scrollToSection('skills');
            break;
            
        case 'clear':
            terminalOutput.innerHTML = `
                <div class="terminal-line">Welcome to DevOps Terminal Game!</div>
                <div class="terminal-line">Type 'help' to see available commands</div>
                <div class="terminal-line">$ <span id="commandHistory"></span></div>
            `;
            return;
            
        case 'ls':
            output.innerHTML = `<span class="output">projects/  skills/  certifications/  contact/  about/  README.md</span>`;
            break;
            
        case 'pwd':
            output.innerHTML = `<span class="output">/home/hemanth/portfolio</span>`;
            break;
            
        case 'date':
            output.innerHTML = `<span class="output">${new Date().toString()}</span>`;
            break;
            
        case 'theme':
            toggleTheme();
            output.innerHTML = `<span class="output">Theme toggled</span>`;
            break;
            
        default:
            if (command.startsWith('echo ')) {
                const text = command.substring(5);
                output.innerHTML = `<span class="output">${text}</span>`;
            } else {
                output.innerHTML = `<span class="output">Command not found: ${command}. Type 'help' for available commands.</span>`;
            }
    }
    
    terminalOutput.appendChild(output);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    terminalInput.value = '';
}

// ====================
// CLOUD ARCHITECTURE VISUALIZER - COMPLETELY FIXED
// Info panel is now separate, no overlap
// ====================
function initArchitectureVisualizer() {
    const serviceDetails = {
        docker: {
            name: "🐳 Docker Container",
            desc: "My microservices-cars project is live on Docker Hub with 97+ pulls! Run it with: docker run -p 3000:5000 heamnth345/microservices-cars.",
            status: "97+ pulls",
            containers: 6,
            uptime: "99.9%",
            load: "34%"
        },
        kubernetes: {
            name: "☸️ Kubernetes",
            desc: "Container orchestration platform for automating deployment, scaling, and management. Manages containerized applications across clusters of hosts.Currently learning Kubernetes orchestration. Familiar with pods, deployments, and services.",
            status: "Orchestrating",
            containers: 1,
            uptime: "99.7%",
            load: "52%"
        },
        database: {
            name: "🗄️ Database Cluster",
            desc: "Redis cache running in my microservices architecture. Used for session management and fast data access.",
            status: "connected",
            containers: 1,
            uptime: "100%",
            load: "15%"
        },
        api: {
            name: "🌐 API Gateway",
            desc: "Nginx gateway routing requests to car-service, auth-service, and user-service in my microservices project.",
            status: "Active",
            containers: 1,
            uptime: "99.8%",
            load: "28%"
        },
        monitoring: {
            name: "📊 Monitoring Stack",
            desc: "Prometheus + Grafana for metrics collection, visualization, and alerting. Tracks system health, performance metrics, and sends notifications.",
            status: "Monitoring",
            containers: 2,
            uptime: "99.9%",
            load: "18%"
        }
    };
    
    // Add click handlers to all cloud services
    cloudServices.forEach(service => {
        service.addEventListener('click', function(e) {
            e.stopPropagation();
            const serviceType = this.getAttribute('data-service');
            const details = serviceDetails[serviceType];
            
            // Update info panel
            serviceName.textContent = details.name;
            serviceDesc.textContent = details.desc;
            serviceStatus.textContent = details.status;
            serviceStatus.className = 'status-badge ' + (details.status === 'Online' || details.status === 'Running' || details.status === 'Active' ? 'online' : 'warning');
            containerCount.textContent = details.containers;
            uptime.textContent = details.uptime;
            load.textContent = details.load;
            
            // Visual feedback - highlight clicked service
            cloudServices.forEach(s => {
                s.style.transform = '';
                s.style.boxShadow = '';
            });
            this.style.transform = 'scale(1.2)';
            this.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.8)';
        });
    });
    
    // Show Microservices Mode
    showMicroservices.addEventListener('click', function() {
        // Remove monolithic mode class
        document.querySelector('.cloud-architecture').classList.remove('monolithic-mode');
        
        // Show all services
        cloudServices.forEach(service => {
            service.style.display = 'flex';
            service.style.opacity = '1';
        });
        
        // Reset positions
        document.querySelector('.cloud-service[data-service="docker"]').style = '';
        document.querySelector('.cloud-service[data-service="kubernetes"]').style = '';
        document.querySelector('.cloud-service[data-service="database"]').style = '';
        document.querySelector('.cloud-service[data-service="api"]').style = '';
        document.querySelector('.cloud-service[data-service="monitoring"]').style = '';
        
        // Show connection lines
        document.querySelectorAll('.connection').forEach(line => {
            line.style.display = 'block';
        });
        
        // Update info panel
        serviceName.textContent = "🏗️ Microservices Architecture";
        serviceDesc.textContent = "Distributed system with independent services communicating via APIs. Each service can be developed, deployed, and scaled independently.";
        serviceStatus.textContent = "Operational";
        serviceStatus.className = 'status-badge online';
        containerCount.textContent = "8";
        uptime.textContent = "99.9%";
        load.textContent = "42%";
    });
    
    // Show Monolithic Mode
    showMonolithic.addEventListener('click', function() {
        // Add monolithic mode class
        document.querySelector('.cloud-architecture').classList.add('monolithic-mode');
        
        // Show only API service (as monolithic)
        cloudServices.forEach(service => {
            const serviceType = service.getAttribute('data-service');
            if (serviceType === 'api') {
                service.style.display = 'flex';
                service.style.opacity = '1';
            } else {
                service.style.display = 'none';
            }
        });
        
        // Hide connection lines
        document.querySelectorAll('.connection').forEach(line => {
            line.style.display = 'none';
        });
        
        // Update info panel
        serviceName.textContent = "📦 Monolithic Architecture";
        serviceDesc.textContent = "Single-tiered application with all components tightly coupled. All functionality is deployed as a single unit, simpler but less scalable.";
        serviceStatus.textContent = "Running";
        serviceStatus.className = 'status-badge online';
        containerCount.textContent = "1";
        uptime.textContent = "99.5%";
        load.textContent = "38%";
    });
    
    // Reset Architecture
    if (resetArchitecture) {
        resetArchitecture.addEventListener('click', function() {
            document.querySelector('.cloud-architecture').classList.remove('monolithic-mode');
            
            cloudServices.forEach(service => {
                service.style.display = 'flex';
                service.style.opacity = '1';
                service.style.transform = '';
                service.style.boxShadow = '';
            });
            
            document.querySelectorAll('.connection').forEach(line => {
                line.style.display = 'block';
            });
            
            // Reset to default info
            serviceName.textContent = "Interactive Architecture";
            serviceDesc.textContent = "Click on any service to see details";
            serviceStatus.textContent = "Operational";
            serviceStatus.className = 'status-badge online';
            containerCount.textContent = "8";
            uptime.textContent = "99.9%";
            load.textContent = "42%";
        });
    }
}

// ====================
// TECH RADAR - WITH INFO PANEL (NEW!)
// Click on radar points to see detailed info below
// ====================
function initTechRadar() {
    console.log("Initializing Tech Radar with Info Panel...");
    
    // Skill details database
    const skillDetails = {
        docker: {
            name: "Docker",
            level: "expert",
            exp: "2 years experience",
            desc: "Published 2 live projects on Docker Hub: microservices-cars (97+ pulls) and sports-cars. Used Docker Compose, multi-container orchestration, and multi-stage builds.",
            projects: "Cars Database Microservices, Monolithic Car Project(sports-cars)."
        },
        git: {
            name: "Git & GitHub",
            level: "expert",
            exp: "2 years experience",
            desc: "Version control for all projects. GitHub Pages deployment, branching strategies, pull requests, and README documentation.",
            projects: "All GitHub repositories."
        },
        linux: {
            name: "Linux",
            level: "proficient",
            exp: "2 years experience",
            desc: "Daily driver for development. Proficient with bash scripting, file systems, process management, and container hosts.",
            projects: "Docker hosts, WSL2 development environment."
        },
        python: {
            name: "Python",
            level: "proficient",
            exp: "2 years experience",
            desc: "Core framework for all microservices. Built REST APIs, JWT authentication, Redis integration, and frontend templating.",
            projects: "Car Database DevOps (GitHub Pages), Portfolio website"
        },
        javascript: {
            name: "JavaScript",
            level: "proficient",
            exp: "2 years experience",
            desc: "Web development language for creating interactive frontend experiences. Used in portfolio projects and web applications.",
            projects: "Car Database frontend, Portfolio website, interactive features"
        },
        aws: {
            name: "AWS",
            level: "familiar",
            exp: "1 year experience",
            desc: "Amazon Web Services - cloud computing platform offering infrastructure services, storage, and computing power. Currently learning and experimenting with core services.",
            projects: "Cloud deployment experiments, learning projects"
        },
        kubernetes: {
            name: "Kubernetes",
            level: "familiar",
            exp: "6 months experience",
            desc: "Currently learning container orchestration. Understanding pods, deployments, services, and ingress.",
            projects: "Learning, mini-projects"
        },
        jenkins: {
            name: "Jenkins",
            level: "familiar",
            exp: "1 year experience",
            desc: "Open-source automation server for building, testing, and deploying software. Used for CI/CD pipeline experiments.",
            projects: "Pipeline experiments, automation learning"
        }
    };
    
    // Add click handlers to all radar points
    radarPoints.forEach(point => {
        point.addEventListener('click', function(e) {
            e.stopPropagation();
            const skill = this.getAttribute('data-skill');
            const details = skillDetails[skill];
            
            if (details) {
                // Update info panel
                techSkillName.textContent = details.name;
                techSkillLevel.textContent = details.level.charAt(0).toUpperCase() + details.level.slice(1);
                techSkillLevel.className = 'level-badge ' + details.level;
                techSkillExp.textContent = details.exp;
                techSkillDesc.textContent = details.desc;
                techSkillProjects.textContent = details.projects;
                
                // Highlight the selected point
                radarPoints.forEach(p => {
                    p.style.transform = '';
                    p.style.zIndex = '20';
                });
                this.style.transform = 'translate(-50%, -50%) scale(1.3)';
                this.style.zIndex = '30';
                
                // Show panel if it was hidden (it never is, but just in case)
                if (techRadarInfoPanel) {
                    techRadarInfoPanel.style.display = 'flex';
                }
            }
        });
        
        // Add hover effect for better UX
        point.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
    
    // Radar filter buttons
    radarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            radarBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const level = this.getAttribute('data-level');
            
            if (level === 'all') {
                radarPoints.forEach(point => {
                    point.style.opacity = '1';
                    point.style.transform = 'translate(-50%, -50%) scale(1)';
                });
                return;
            }
            
            radarPoints.forEach(point => {
                const pointLevel = point.getAttribute('data-level');
                if (pointLevel === level) {
                    point.style.opacity = '1';
                    point.style.transform = 'translate(-50%, -50%) scale(1)';
                } else {
                    point.style.opacity = '0.3';
                    point.style.transform = 'translate(-50%, -50%) scale(0.8)';
                }
            });
        });
    });
    
    // Set default selection (Docker) on page load
    setTimeout(() => {
        const dockerPoint = document.querySelector('.radar-point[data-skill="docker"]');
        if (dockerPoint) {
            dockerPoint.click();
        }
    }, 500);
}

// ====================
// PROJECT ARCHITECTURE MODAL
// ====================
function initProjectArchitecture() {
    const architectureBtns = document.querySelectorAll('.show-architecture');
    const architectureModal = document.createElement('div');
    
    architectureModal.innerHTML = `
        <div class="architecture-modal">
            <div class="architecture-modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-project-diagram"></i> <span id="modalTitle">Project Architecture</span></h3>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" id="modalBody">
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(architectureModal);
    const modal = document.querySelector('.architecture-modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    architectureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const archType = btn.getAttribute('data-arch');
            
            if (archType === 'microservices') {
                showMicroservicesDiagram();
            } else if (archType === 'monolithic') {
                showMonolithicDiagram();
            }
            
            modal.style.display = 'flex';
        });
    });
    
    function showMicroservicesDiagram() {
        modalTitle.textContent = "Microservices Architecture - Cars Database";
        modalBody.innerHTML = `
            <div class="microservices-diagram">
                <div class="diagram-service">
                    <i class="fas fa-broadcast-tower"></i>
                    <div class="diagram-service-label">REST API</div>
                    <div class="diagram-service-desc">API Gateway</div>
                </div>
                <div class="diagram-service">
                    <i class="fas fa-user-circle"></i>
                    <div class="diagram-service-label">Account Service</div>
                    <div class="diagram-service-desc">User Management</div>
                </div>
                <div class="diagram-service">
                    <i class="fas fa-database"></i>
                    <div class="diagram-service-label">Account DB</div>
                    <div class="diagram-service-desc">User Data</div>
                </div>
                <div class="diagram-service">
                    <i class="fas fa-boxes"></i>
                    <div class="diagram-service-label">Inventory Service</div>
                    <div class="diagram-service-desc">Stock Management</div>
                </div>
                <div class="diagram-service">
                    <i class="fas fa-database"></i>
                    <div class="diagram-service-label">Inventory DB</div>
                    <div class="diagram-service-desc">Product Data</div>
                </div>
                <div class="diagram-connections">
                    <i class="fas fa-network-wired"></i>
                    <div class="diagram-service-label">Communication Flow</div>
                    <div class="diagram-service-desc">All services communicate via REST API Gateway</div>
                </div>
            </div>
        `;
    }
    
    function showMonolithicDiagram() {
        modalTitle.textContent = "Monolithic Architecture - Car Project";
        modalBody.innerHTML = `
            <div class="monolithic-diagram">
                <div class="monolithic-main">
                    <i class="fas fa-cube"></i>
                    <h4>E-Commerce Monolithic App</h4>
                    <div class="diagram-components">
                        <span class="component">Shop UI</span>
                        <span class="component">Catalog Service</span>
                        <span class="component">SC Service</span>
                        <span class="component">Discount Service</span>
                        <span class="component">Order Service</span>
                        <span class="component">RDBMS</span>
                    </div>
                </div>
                <div class="diagram-service">
                    <i class="fas fa-balance-scale"></i>
                    <div class="diagram-service-label">Load Balancer</div>
                    <div class="diagram-service-desc">Traffic Distribution</div>
                </div>
                <div style="display: flex; gap: 20px; margin-top: 20px;">
                    <div class="diagram-service">
                        <i class="fas fa-laptop"></i>
                        <div class="diagram-service-label">Client</div>
                        <div class="diagram-service-desc">Web Users</div>
                    </div>
                    <div class="diagram-service">
                        <i class="fas fa-mobile-alt"></i>
                        <div class="diagram-service-label">Client</div>
                        <div class="diagram-service-desc">Mobile Users</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// ====================
// CODE SNIPPETS
// ====================
function initCodeSnippets() {
    snippetTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            snippetTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.snippet-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(`${tabId}-snippets`).classList.add('active');
        });
    });
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const codeType = button.getAttribute('data-code');
            let textToCopy = '';
            
            switch(codeType) {
                case 'dockerfile':
                    textToCopy = `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]`;
                    break;
                    
                case 'compose':
                    textToCopy = `version: '3.8'
services:
  car-service:
    build: ./car-service
    ports:
      - "5001:5000"
  auth-service:
    build: ./auth-service
    ports:
      - "5002:5000"
  redis:
    image: redis:alpine`;
                    break;
                    
                case 'gitflow':
                    textToCopy = `git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Hemanth870-tech/repo
git push -u origin main

git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature`;
                    break;
                    
                case 'github-actions':
                    textToCopy = `name: Docker Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t myapp .`;
                    break;
                    
                case 'commands':
                    textToCopy = `# Docker Commands
docker ps
docker pull heamnth345/microservices-cars
docker run -p 3000:5000 heamnth345/microservices-cars
docker logs [container-id]

# Git Commands
git status
git log --oneline --graph
git diff
git stash

# System Monitoring
htop
df -h
free -h
journalctl -f`;
                    break;
            }
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            });
        });
    });
}

// ====================
// CONTACT FORM HANDLER - FIXED VERSION
// ====================
function initContactForm() {
    console.log("🔍 initContactForm() running...");
    
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.error("❌ CRITICAL ERROR: contactForm element not found!");
        console.log("Available forms:", document.querySelectorAll('form'));
        console.log("Element with ID 'contactForm':", document.getElementById('contactForm'));
        return;
    }
    
    console.log("✅ contactForm found successfully!");
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("📤 Form submitted!");
        
        const formData = new FormData(this);
        
        fetch('/contact/submit/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("✅ Server response:", data);
            if (data.success) {
                alert("✅ Message sent successfully!");
                this.reset();
            } else {
                alert("❌ Error: " + data.message);
            }
        })
        .catch(error => {
            console.error("❌ Fetch error:", error);
            alert("❌ Network error - check console");
        });
    });
}

// ====================
// UTILITY FUNCTIONS
// ====================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        speak(`Scrolling to ${sectionId}`);
    }
}

// ====================
// EVENT LISTENERS & INIT
// ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Portfolio Initializing...");
    
    // Initialize all systems
    initTypingAnimation();
    initVoiceRecognition();
    initArchitectureVisualizer();
    initProjectArchitecture();
    initTechRadar();
    initCodeSnippets();
    initContactForm();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Set current year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    
    voiceToggle.addEventListener('click', () => {
        if (isListening) stopVoiceRecognition();
        else startVoiceRecognition();
    });
    
    terminalToggle.addEventListener('click', openTerminal);
    quickTerminal.addEventListener('click', openTerminal);
    closeTerminal.addEventListener('click', closeTerminalModal);
    
    if (terminalInput) {
        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleTerminalCommand(terminalInput.value);
        });
    }
    
    if (closeVoiceNote) {
        closeVoiceNote.addEventListener('click', () => {
            voiceNotification.style.display = 'none';
        });
    }
    
    terminalModal.addEventListener('click', (e) => {
        if (e.target === terminalModal) closeTerminalModal();
    });
    
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.remove('active');
        });
    });
    
    const footerTerminal = document.getElementById('footerTerminal');
    if (footerTerminal) {
        footerTerminal.addEventListener('click', openTerminal);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            openTerminal();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
        if (e.key === 'Escape') {
            closeTerminalModal();
        }
    });
    
    // Show voice notification
    setTimeout(() => {
        if (voiceNotification) voiceNotification.style.display = 'flex';
    }, 2000);
    
    // Add CSS for dynamic elements
    const style = document.createElement('style');
    style.textContent = `
        .voice-feedback {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            z-index: 1002;
            animation: fadeInOut 2s ease;
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateY(-10px); }
            20%, 80% { opacity: 1; transform: translateY(0); }
        }
        
        .terminal-line .accent {
            color: #60a5fa;
        }
        
        .terminal-line .output {
            color: #34d399;
        }
    `;
    document.head.appendChild(style);
    
    console.log("✅ Portfolio fully initialized!");
});