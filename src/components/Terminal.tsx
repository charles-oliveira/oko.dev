import { useState, useEffect, useRef } from 'react';
import '../styles/Terminal.css';

interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => string[];
}

interface File {
  name: string;
  content: string;
  lastModified: Date;
}

export const Terminal = () => {
  const [log, setLog] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [currentDir, setCurrentDir] = useState('~');
  const [files, setFiles] = useState<Record<string, File>>(() => {
    // Carrega arquivos do localStorage ao iniciar
    const savedFiles = localStorage.getItem('terminal_files');
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);
      // Converte strings de data de volta para objetos Date
      Object.keys(parsedFiles).forEach(key => {
        parsedFiles[key].lastModified = new Date(parsedFiles[key].lastModified);
      });
      return parsedFiles;
    }
    return {};
  });
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Salva arquivos no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('terminal_files', JSON.stringify(files));
  }, [files]);

  const commands: Record<string, Command> = {
    help: {
      name: 'help',
      description: 'Mostra todos os comandos disponíveis',
      execute: () => [
        'Comandos disponíveis:',
        '  help         - Mostra esta mensagem',
        '  ls           - Lista arquivos e diretórios',
        '  cd [dir]     - Navega entre diretórios',
        '  cat [file]   - Mostra conteúdo do arquivo',
        '  clear        - Limpa o terminal',
        '  whoami       - Mostra informações do usuário',
        '  date         - Mostra data e hora',
        '  echo [text]  - Repete o texto digitado',
        '  login        - Acesso ao sistema',
        '  logout       - Sair do sistema',
        '  edit [file]  - Cria/edita arquivo .txt com markdown',
        '  save         - Salva o arquivo em edição',
        '  exit         - Sai do modo de edição',
      ],
    },
    ls: {
      name: 'ls',
      description: 'Lista arquivos e diretórios',
      execute: () => [
        'drwxr-xr-x 2 user user 4096 Apr 20 12:00 .',
        'drwxr-xr-x 3 user user 4096 Apr 20 12:00 ..',
        '-rw-r--r-- 1 user user  123 Apr 20 12:00 README.md',
        'drwxr-xr-x 2 user user 4096 Apr 20 12:00 src',
        'drwxr-xr-x 2 user user 4096 Apr 20 12:00 public',
        '-rw-r--r-- 1 user user  456 Apr 20 12:00 package.json',
      ],
    },
    cd: {
      name: 'cd',
      description: 'Navega entre diretórios',
      execute: (args) => {
        if (args.length === 0) {
          setCurrentDir('~');
          return ['Retornando ao diretório home'];
        }
        const dir = args[0];
        if (dir === '..') {
          setCurrentDir('~');
          return ['Retornando ao diretório anterior'];
        }
        setCurrentDir(`~/${dir}`);
        return [`Mudando para o diretório ${dir}`];
      },
    },
    cat: {
      name: 'cat',
      description: 'Mostra conteúdo do arquivo',
      execute: (args) => {
        if (args.length === 0) return ['Erro: Nenhum arquivo especificado'];
        const file = args[0];
        if (file === 'README.md') {
          return [
            '# 0ko.dev',
            'Sistema operacional web inspirado em Windows 95/98',
            'Desenvolvido com React, TypeScript e Vite',
          ];
        }
        return [`Arquivo ${file} não encontrado`];
      },
    },
    clear: {
      name: 'clear',
      description: 'Limpa o terminal',
      execute: () => {
        setLog([]);
        return [];
      },
    },
    whoami: {
      name: 'whoami',
      description: 'Mostra informações do usuário',
      execute: () => [
        'Usuário: ch4rle2',
        'Grupo: developers',
        'UID: 1000',
        'GID: 1000',
      ],
    },
    date: {
      name: 'date',
      description: 'Mostra data e hora',
      execute: () => [new Date().toLocaleString()],
    },
    echo: {
      name: 'echo',
      description: 'Repete o texto digitado',
      execute: (args) => [args.join(' ')],
    },
    login: {
      name: 'login',
      description: 'Acesso ao sistema',
      execute: () => {
        if (authenticated) {
          return ['Você já está autenticado'];
        }
        setAuthenticated(true);
        return ['Autenticação bem-sucedida. Bem-vindo!'];
      },
    },
    logout: {
      name: 'logout',
      description: 'Sair do sistema',
      execute: () => {
        if (!authenticated) {
          return ['Você não está autenticado'];
        }
        setAuthenticated(false);
        return ['Logout realizado com sucesso'];
      },
    },
    edit: {
      name: 'edit',
      description: 'Cria/edita arquivo .txt com markdown',
      execute: (args) => {
        if (args.length === 0) {
          return ['Erro: Nome do arquivo não especificado'];
        }
        const filename = args[0];
        if (!filename.endsWith('.txt')) {
          return ['Erro: O arquivo deve ter extensão .txt'];
        }
        if (currentDir !== '~') {
          return ['Erro: Arquivos só podem ser criados/editados no diretório home (~)'];
        }
        
        setEditingFile(filename);
        if (files[filename]) {
          setInput(files[filename].content);
          return [`Editando arquivo existente: ${filename}`];
        } else {
          setInput('');
          return [`Criando novo arquivo: ${filename}`];
        }
      },
    },
    save: {
      name: 'save',
      description: 'Salva o arquivo em edição',
      execute: () => {
        if (!editingFile) {
          return ['Erro: Nenhum arquivo em edição'];
        }
        
        setFiles(prev => {
          const newFiles = {
            ...prev,
            [editingFile]: {
              name: editingFile,
              content: input,
              lastModified: new Date()
            }
          };
          // Salva no localStorage
          localStorage.setItem('terminal_files', JSON.stringify(newFiles));
          return newFiles;
        });
        
        setEditingFile(null);
        setInput('');
        return [`Arquivo ${editingFile} salvo com sucesso`];
      },
    },
    exit: {
      name: 'exit',
      description: 'Sai do modo de edição',
      execute: () => {
        if (!editingFile) {
          return ['Erro: Nenhum arquivo em edição'];
        }
        
        setEditingFile(null);
        setInput('');
        return ['Modo de edição encerrado'];
      },
    },
  };

  const handleCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().split(' ');
    const lowerCommand = command.toLowerCase();

    if (editingFile) {
      if (command === 'save' || command === '') {
        // Salva automaticamente quando pressionar Enter ou digitar 'save'
        const output = commands.save.execute([]);
        setLog((prev) => [...prev, `> ${cmd}`, ...output]);
      } else if (command === 'exit') {
        const output = commands.exit.execute([]);
        setLog((prev) => [...prev, `> ${cmd}`, ...output]);
      } else {
        // Adiciona o texto ao conteúdo do arquivo
        setInput(prev => prev + (prev ? '\n' : '') + cmd);
      }
    } else {
      if (commands[lowerCommand]) {
        const output = commands[lowerCommand].execute(args);
        setLog((prev) => [...prev, `> ${cmd}`, ...output]);
      } else {
        setLog((prev) => [...prev, `> ${cmd}`, 'Comando não encontrado. Digite "help" para ver os comandos disponíveis']);
      }
      setInput('');
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div className="terminal" ref={terminalRef}>
      <div className="terminal-content">
        {log.map((line, i) => (
          <div key={i} className="terminal-line">
            {line}
          </div>
        ))}
        <div className="terminal-input">
          <span className="prompt">
            {editingFile 
              ? `[EDITANDO] ${editingFile} > `
              : `ch4rle2@0ko.dev:${currentDir} ${authenticated ? '#' : '$'}`}
          </span>
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
    </div>
  );
};
