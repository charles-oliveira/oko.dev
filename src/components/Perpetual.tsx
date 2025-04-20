import React, { useState, useEffect } from 'react';
import '../styles/Perpetual.css';

export const Perpetual: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [easterEggs, setEasterEggs] = useState<Record<string, boolean>>({
    'Kier': false,
    'Lumon': false,
    'Severance': false,
    'Helly': false,
    'Mark': false
  });
  const [showSecret, setShowSecret] = useState<boolean>(false);

  const perpetualText = `[SISTEMA LUMON INDUSTRIES]
  
[PROTOCOLO DE SEPARAÇÃO]
- Início do Processo: 07:00
- Término do Processo: 17:00
- Status: Ativo
- Versão: 3.1.0

[DIRETIVAS DO DEPARTAMENTO DE REFINAMENTO DE DADOS]
1. Manter a separação entre as consciências
2. Preservar a integridade dos números
3. Garantir a continuidade do processo
4. Evitar contaminação entre memórias

[ESTADO ATUAL]
- Funcionários Ativos: 4
- Arquivos Processados: ∞
- Erros Detectados: 0
- Tempo de Operação: Eterno

[ALERTA DE SEGURANÇA]
Acesso restrito ao Departamento de Refinamento.
Qualquer tentativa de violação do protocolo de separação
será registrada e reportada ao Conselho de Ética.

[REFERÊNCIAS]
- MDR: Departamento de Refinamento de Dados
- O&D: Departamento de Design e Operações
- Macrodata: Processamento de Dados Corporativos
- Kier: Fundador e Visionário

[NOTA]
"O trabalho é misterioso, mas o propósito é claro."
- E. Kier`;

  const secretText = `[ARQUIVO CLASSIFICADO]
  
[PROTOCOLO DE EMERGÊNCIA]
- Código de Acesso: 3-2-7
- Nível de Segurança: MÁXIMO
- Localização: Subnível 3

[INSTRUÇÕES]
1. Localizar o painel de controle
2. Inserir o código de acesso
3. Aguardar a confirmação
4. Não olhar para trás

[AVISO]
Este arquivo será auto-destruído em 5 segundos...`;

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < perpetualText.length) {
        setText(perpetualText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isTyping) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [isTyping]);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const text = target.textContent || '';
    
    // Verifica se o texto clicado é um easter egg
    Object.keys(easterEggs).forEach(key => {
      if (text.includes(key)) {
        setEasterEggs(prev => ({
          ...prev,
          [key]: true
        }));
      }
    });

    // Verifica se todos os easter eggs foram encontrados
    if (Object.values(easterEggs).every(found => found)) {
      setShowSecret(true);
      setTimeout(() => {
        setShowSecret(false);
        setEasterEggs(prev => Object.keys(prev).reduce((acc, key) => ({
          ...acc,
          [key]: false
        }), {}));
      }, 5000);
    }
  };

  return (
    <div className="perpetual">
      <div className="perpetual-content" onClick={handleClick}>
        <pre className="perpetual-text">
          {text}
          {!isTyping && showCursor && <span className="perpetual-cursor">_</span>}
        </pre>
        {showSecret && (
          <div className="secret-text">
            <pre>{secretText}</pre>
          </div>
        )}
      </div>
    </div>
  );
}; 