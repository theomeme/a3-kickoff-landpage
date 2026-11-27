# Lista de espera no Google Sheets

O formulário da landing page envia cada e-mail para uma planilha do Google, por meio de um pequeno script (Google Apps Script). Enquanto a URL do script não estiver configurada, o formulário funciona em modo demonstração e não envia nada.

## Configurar (uns 5 minutos)

1. Crie uma planilha nova no Google Sheets, por exemplo "Lista de espera".
2. Na planilha, abra **Extensões > Apps Script**.
3. Apague o conteúdo do arquivo `Código.gs` e cole o conteúdo de [`apps-script/lista-de-espera.gs`](../apps-script/lista-de-espera.gs). Salve.
4. Clique em **Implantar > Nova implantação**.
   - Em "Selecionar tipo", escolha **App da Web**.
   - **Executar como:** Eu.
   - **Quem pode acessar:** Qualquer pessoa.
5. Clique em **Implantar** e autorize o acesso com sua conta Google. (O Google mostra um aviso de "app não verificado" porque o script é seu; clique em "Avançado" e continue.)
6. Copie a **URL do app da Web** (termina em `/exec`).
7. Em `index.html`, cole essa URL na linha:

   ```js
   const LISTA_DE_ESPERA_URL = '';
   ```

Pronto. A primeira inscrição cria a aba **Inscritos** com as colunas `data`, `email`, `origem` (formulário do topo ou do final) e `pagina`.

## Bom saber

- **E-mails repetidos** não são gravados duas vezes.
- **Spam:** o formulário tem um campo invisível que só robôs preenchem; essas inscrições são descartadas.
- **Mudou o script?** Use **Implantar > Gerenciar implantações > editar (lápis) > Versão: Nova versão**. Assim a URL continua a mesma. Uma "Nova implantação" gera outra URL.
- **Confirmação na página:** por limitação do Google, a página não consegue ler a resposta do script. Ela mostra "você está na lista" sempre que o envio sai do navegador, e só mostra erro se a conexão falhar. Teste uma inscrição e confira se ela apareceu na planilha.
- **LGPD:** a planilha guarda e-mails de pessoas. Mantenha o compartilhamento restrito e use os e-mails só para avisar sobre o lançamento.
