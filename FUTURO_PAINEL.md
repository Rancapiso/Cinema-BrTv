# Como adicionar painel administrativo depois (roadmap)

Hoje o app faz login direto no servidor (Xtream).
Para adicionar seu painel, o caminho mais limpo é:

1) Criar um backend seu que:
   - autentique o cliente (plano/trial)
   - valide device_id / limite de dispositivos
   - devolva (ou valide) as credenciais Xtream, se você quiser esconder do cliente

2) No app:
   - substituir `services/xtream.ts` por um resolver:
     - app -> seu backend -> (backend chama xtream) -> app
   - manter a UI igual (não muda telas)

Você pode começar adicionando um arquivo:
- `src/services/adminGate.ts` (stub)
e chamar antes do Home.
