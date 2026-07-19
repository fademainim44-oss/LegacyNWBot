const mineflayer = require('mineflayer');
const express = require('express');

// --- 7/24 AÇIK KALMASI İÇİN UPTIME SUNUCUSU ---
const app = express();
app.get('/', (req, res) => {
    res.send('LegacyNWBot 7/24 Aktif! UptimeRobot başarıyla ping atıyor.');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[UPTIME] Web sunucusu ${PORT} portunda dinleniyor.`);
});
// ----------------------------------------------

// --- MINECRAFT BOT AYARLARI ---
const AYARLAR = {
    ip: 'LegacyNetwork.enderman.cloud',
    port: 25565,
    isim: 'LegacyNWBot'
};

function botuBaslat() {
    console.log(`[BAĞLANTI] ${AYARLAR.isim}, ${AYARLAR.ip} adresine bağlanıyor...`);
    
    const bot = mineflayer.createBot({
        host: AYARLAR.ip,
        port: AYARLAR.port,
        username: AYARLAR.isim,
        version: false // Sunucu sürümünü otomatik algılar
    });

    bot.once('spawn', () => {
        console.log(`[BAŞARILI] ${AYARLAR.isim} sunucuya giriş yaptı ve dünyada doğdu!`);
        
        // Anti-AFK (5 dakikada bir zıplar)
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 1000);
        }, 300000);
    });

    // Kayıt ve Giriş İşlemleri (AuthMe)
    bot.on('message', (message) => {
        const msg = message.toString().toLowerCase();
        
        if (msg.includes('/register') || msg.includes('kayit') || msg.includes('register')) {
            bot.chat('/register legacy123 legacy123');
            setTimeout(() => bot.chat('/login legacy123'), 2000);
            console.log('[AUTH] Sunucuya kayıt olundu ve giriş yapıldı.');
        } else if (msg.includes('/login') || msg.includes('sifre') || msg.includes('giris')) {
            bot.chat('/login legacy123');
            console.log('[AUTH] Sunucuya giriş yapıldı.');
        }
    });

    // Bağlantı koparsa veya hata alırsa otomatik yeniden bağlan
    bot.on('kicked', (sebep) => {
        console.log(`[HATA] Bot sunucudan atıldı! Sebep:`, sebep);
        console.log('[SİSTEM] 10 saniye sonra tekrar bağlanıyor...');
        setTimeout(botuBaslat, 10000);
    });

    bot.on('error', (hata) => {
        console.log(`[HATA] Bir bağlantı hatası oluştu.`);
        console.log('[SİSTEM] 10 saniye sonra tekrar bağlanıyor...');
        setTimeout(botuBaslat, 10000);
    });

    bot.on('end', () => {
        console.log(`[BİLGİ] Sunucuyla bağlantı kesildi (Sunucu kapanmış veya restart atılmış olabilir).`);
        console.log('[SİSTEM] 10 saniye sonra tekrar bağlanıyor...');
        setTimeout(botuBaslat, 10000);
    });
}

// Botu ilk kez başlat
botuBaslat();
