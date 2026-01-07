// 인증 관련 유틸리티 함수

// 테스트 계정 정보
const TEST_ACCOUNTS = {
    doctor: {
        email: 'doctor@example.com',
        password: 'doctor123',
        name: '김의사'
    },
    hospital: {
        email: 'hospital@example.com',
        password: 'hospital123',
        name: '중앙연세의원'
    }
};

// 로그인 검증
function validateLogin(email, password, userType) {
    try {
        // 입력값 정리
        email = email.trim().toLowerCase();
        
        console.log('검증 시작:', { userType, email, passwordLength: password.length });
        
        const account = TEST_ACCOUNTS[userType];
        if (!account) {
            console.error('잘못된 사용자 유형:', userType);
            return { success: false, message: '잘못된 사용자 유형입니다.' };
        }
        
        console.log('계정 정보:', { storedEmail: account.email, storedPassword: account.password });
        
        if (account.email.toLowerCase() === email && account.password === password) {
            console.log('로그인 성공');
            return {
                success: true,
                userType: userType,
                email: account.email,
                name: account.name
            };
        }
        
        console.log('로그인 실패: 이메일 또는 비밀번호 불일치');
        return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    } catch (error) {
        console.error('검증 오류:', error);
        return { success: false, message: '로그인 검증 중 오류가 발생했습니다.' };
    }
}

// 로그인 정보 저장
function saveLoginInfo(userInfo, rememberMe = false) {
    const loginData = {
        userType: userInfo.userType,
        email: userInfo.email,
        name: userInfo.name,
        loginTime: new Date().toISOString()
    };
    
    if (rememberMe) {
        localStorage.setItem('loginInfo', JSON.stringify(loginData));
    } else {
        sessionStorage.setItem('loginInfo', JSON.stringify(loginData));
    }
}

// 로그인 정보 가져오기
function getLoginInfo() {
    const localInfo = localStorage.getItem('loginInfo');
    const sessionInfo = sessionStorage.getItem('loginInfo');
    
    if (localInfo) {
        return JSON.parse(localInfo);
    }
    if (sessionInfo) {
        return JSON.parse(sessionInfo);
    }
    return null;
}

// 로그아웃
function logout() {
    localStorage.removeItem('loginInfo');
    sessionStorage.removeItem('loginInfo');
    window.location.href = 'login.html';
}

// 로그인 상태 확인 및 페이지 보호
function checkAuth(requiredUserType = null) {
    const loginInfo = getLoginInfo();
    
    if (!loginInfo) {
        // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        window.location.href = 'login.html';
        return false;
    }
    
    // 특정 유형의 사용자만 접근 가능한 페이지인 경우
    if (requiredUserType && loginInfo.userType !== requiredUserType) {
        // 권한이 없는 경우 해당 대시보드로 리다이렉트
        if (loginInfo.userType === 'doctor') {
            window.location.href = 'doctor-dashboard.html';
        } else {
            window.location.href = 'hospital-dashboard.html';
        }
        return false;
    }
    
    return loginInfo;
}

// 사용자 이름 표시 업데이트
function updateUserName() {
    const loginInfo = getLoginInfo();
    if (loginInfo) {
        const nameElements = document.querySelectorAll('.user-name');
        nameElements.forEach(el => {
            el.textContent = loginInfo.name;
        });
    }
}

// 네비게이션에 로그인 상태 반영
function updateNavigation() {
    const loginInfo = getLoginInfo();
    const navLinks = document.querySelectorAll('.nav-links');
    
    navLinks.forEach(nav => {
        if (loginInfo) {
            // 로그인된 경우
            const existingLoginLinks = nav.querySelectorAll('.login-link');
            existingLoginLinks.forEach(link => link.remove());
            
            // 대시보드 링크 추가
            if (loginInfo.userType === 'doctor') {
                if (!nav.querySelector('a[href="doctor-dashboard.html"]')) {
                    const dashboardLink = document.createElement('a');
                    dashboardLink.href = 'doctor-dashboard.html';
                    dashboardLink.textContent = '대시보드';
                    nav.appendChild(dashboardLink);
                }
            } else {
                if (!nav.querySelector('a[href="hospital-dashboard.html"]')) {
                    const dashboardLink = document.createElement('a');
                    dashboardLink.href = 'hospital-dashboard.html';
                    dashboardLink.textContent = '대시보드';
                    nav.appendChild(dashboardLink);
                }
            }
            
            // 로그아웃 버튼 추가
            if (!nav.querySelector('.logout-link')) {
                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.className = 'logout-link';
                logoutLink.textContent = '로그아웃';
                logoutLink.onclick = (e) => {
                    e.preventDefault();
                    if (confirm('로그아웃하시겠습니까?')) {
                        logout();
                    }
                };
                nav.appendChild(logoutLink);
            }
        } else {
            // 로그인하지 않은 경우
            const existingDashboardLinks = nav.querySelectorAll('a[href*="dashboard"]');
            existingDashboardLinks.forEach(link => link.remove());
            
            const existingLogoutLinks = nav.querySelectorAll('.logout-link');
            existingLogoutLinks.forEach(link => link.remove());
            
            if (!nav.querySelector('.login-link')) {
                const loginLink = document.createElement('a');
                loginLink.href = 'login.html';
                loginLink.className = 'login-link';
                loginLink.textContent = '로그인';
                nav.appendChild(loginLink);
            }
        }
    });
}
