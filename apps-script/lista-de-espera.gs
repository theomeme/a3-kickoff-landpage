/**
 * Lista de espera: recebe os e-mails do formulário da landing page
 * e grava numa aba da planilha. Cole este arquivo no Apps Script da
 * planilha (Extensões > Apps Script). Passo a passo em docs/lista-de-espera.md.
 */
const NOME_DA_ABA = 'Inscritos';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};

    // Campo invisível: só robôs preenchem. Fingimos sucesso e ignoramos.
    if (p.site) return resposta_({ ok: true });

    const email = String(p.email || '').trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return resposta_({ ok: false, erro: 'email_invalido' });
    }

    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    const aba = planilha.getSheetByName(NOME_DA_ABA) || planilha.insertSheet(NOME_DA_ABA);
    if (aba.getLastRow() === 0) {
      aba.appendRow(['data', 'email', 'origem', 'pagina']);
      aba.setFrozenRows(1);
    }

    // Não grava o mesmo e-mail duas vezes.
    const ultima = aba.getLastRow();
    if (ultima > 1) {
      const existentes = aba.getRange(2, 2, ultima - 1, 1).getValues().flat();
      if (existentes.indexOf(email) !== -1) return resposta_({ ok: true, repetido: true });
    }

    aba.appendRow([
      new Date(),
      texto_(email),
      texto_(String(p.origem || '').slice(0, 40)),
      texto_(String(p.pagina || '').slice(0, 200)),
    ]);
    return resposta_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Evita que um valor começando com = + - @ vire fórmula na planilha.
function texto_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function resposta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
