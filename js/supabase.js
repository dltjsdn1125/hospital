// Supabase 클라이언트 초기화
const SUPABASE_URL = 'https://gwntknjohqljnwxyajcr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bnRrbmpvaHFsam53eHlhamNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTIyNDMsImV4cCI6MjA4MjA2ODI0M30.DLopxpl1Vx3H_PSmDDwBW_NcT3goD2Ob95TnxEnWGls';

// CDN에서 Supabase 클라이언트 로드
let supabaseClient = null;

// Supabase 클라이언트 초기화
async function initSupabase() {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return supabaseClient;
    }
    
    // CDN에서 동적으로 로드
    return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="supabase"]')) {
            // 이미 로드됨
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            resolve(supabaseClient);
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
        script.type = 'module';
        script.onload = () => {
            // 모듈 방식이므로 직접 사용
            import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm').then(({ createClient }) => {
                supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                resolve(supabaseClient);
            }).catch(reject);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Supabase 클라이언트 가져오기 (동기 방식 - UMD 버전 사용)
function getSupabase() {
    if (!supabaseClient) {
        // UMD 버전 사용 (동기 로드 가능)
        if (typeof window.supabase !== 'undefined') {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } else {
            console.error('Supabase 클라이언트가 아직 로드되지 않았습니다. initSupabase()를 먼저 호출하세요.');
        }
    }
    return supabaseClient;
}

// 페이지 로드 시 자동 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initSupabase().catch(console.error);
    });
} else {
    initSupabase().catch(console.error);
}
