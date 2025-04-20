import { useState } from 'react';
import '../styles/Terminal.css';

export const Terminal = () => {
  const [log, setLog] = useState<string[]>(['> digite um comando...']);
  const [input, setInput] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const delayLog = (lines: string[], delay = 300) => {
    lines.forEach((line, i) => {
      setTimeout(() => {
        setLog((prev) => [...prev, line]);
      }, i * delay);
    });
  };

  const handleCommand = (cmd: string) => {
    const lower = cmd.trim().toLowerCase();

    if (lower === 'help') {
      setLog((prev) => [
        ...prev,
        '> help',
        'Comandos disponíveis:',
        '  help         - Lista comandos',
        '  login        - Acesso autorizado',
        '  logs         - Ver registros (após login)',
        '  clear        - Limpar terminal',
      ]);
    } else if (lower === 'login') {
      if (authenticated) {
        setLog((prev) => [...prev, '> login', 'Acesso já concedido.']);
        return;
      }

      setLog((prev) => [...prev, '> login', 'Autenticando...']);
      setTimeout(() => {
        setAuthenticated(true);
        setLog((prev) => [...prev, '[DHARMA] Identificação confirmada. Acesso concedido.']);
      }, 1000);
    } else if (lower === 'logs') {
      if (!authenticated) {
        setLog((prev) => [...prev, '> logs', '[ERRO] Acesso negado. Use "login" antes.']);
        return;
      }

      const fakeLogs = [
        '[DHARMA SYS] Inicializando protocolos...',
        '[SYS] Verificando integridade da estação... OK',
        '[DHARMA NET] Transmissão interceptada. Código: 3X7',
        '[OBS] Sujeito 047 interagiu com terminal sem permissão.',
        '[CORE] Atividade cerebral aumentada detectada.',
        '[WARNING] Frequência 108 ativa.',
        '[SECURITY] Portão B-7 aberto às 03:42.',
        '[SYS] Desvio de energia detectado no setor 5.',
        '[LOG] Executando protocolo de contenção EMERG-41',
        '[SYS] Finalizando sessão segura.'
      ];

      delayLog([`> logs`, 'Carregando registros...'], 400);
      delayLog(fakeLogs, 500);
    } else if (lower === 'clear') {
      setLog([]);
    } else {
      setLog((prev) => [...prev, `> ${cmd}`, 'Comando não reconhecido. Digite "help" para ajuda.']);
    }

    setInput('');
  };

  return (
    <div className="terminal">
      {log.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      <div>
        <span>&gt; </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommand(input);
          }}
          autoFocus
        />
      </div>
    </div>
  );
};
