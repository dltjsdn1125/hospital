// Supabase 설정 파일
// HTML에서 직접 사용 가능하도록 UMD 방식으로 작성

(function() {
    'use strict';
    
    const SUPABASE_URL = 'https://gwntknjohqljnwxyajcr.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bnRrbmpvaHFsam53eHlhamNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTIyNDMsImV4cCI6MjA4MjA2ODI0M30.DLopxpl1Vx3H_PSmDDwBW_NcT3goD2Ob95TnxEnWGls';
    
    let supabaseClient = null;
    
    // Supabase 클라이언트 초기화
    function initSupabase() {
        if (typeof window.supabase === 'undefined') {
            console.error('Supabase 라이브러리가 로드되지 않았습니다.');
            return null;
        }
        
        if (!supabaseClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase 클라이언트 초기화 완료');
        }
        
        return supabaseClient;
    }
    
    // 전역으로 노출
    window.SupabaseConfig = {
        URL: SUPABASE_URL,
        ANON_KEY: SUPABASE_ANON_KEY,
        getClient: initSupabase
    };
})();
