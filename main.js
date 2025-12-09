import React, { useState, useEffect } from 'react';
import { Calendar, Check, Truck, Home, PartyPopper, Trash2 } from 'lucide-react';

export default function App() {
  // Datas fixas
  // Mês em JS começa em 0 (Jan=0, Fev=1), então Fev é 1.
  const targetDate = new Date(2026, 1, 23); // 23 de Fevereiro de 2026
  const startDate = new Date(2025, 11, 2);  // 02 de Dezembro de 2025 (Data inicial do app)

  // Estado para armazenar os dias marcados
  const [checkedDates, setCheckedDates] = useState(() => {
    const saved = localStorage.getItem('moveChecklist');
    return saved ? JSON.parse(saved) : [];
  });

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('moveChecklist', JSON.stringify(checkedDates));
  }, [checkedDates]);

  // Função para formatar data (dd/mm)
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  // Função para formatar data completa
  const formatFullDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Gerar array de dias entre hoje e a data alvo
  const generateDaysArray = () => {
    const days = [];
    let currentDate = new Date(startDate);

    while (currentDate <= targetDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const allDays = generateDaysArray();
  const totalDays = allDays.length;
  const daysCompleted = checkedDates.length;
  
  // Calcular dias restantes reais baseados na data atual do sistema vs data alvo
  const calculateRealTimeRemaining = () => {
    const now = new Date();
    // Zerar horas para comparação justa
    now.setHours(0,0,0,0);
    const target = new Date(targetDate);
    
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 0;
  };

  const realDaysRemaining = calculateRealTimeRemaining();

  // Toggle do check
  const toggleDate = (dateStr) => {
    if (checkedDates.includes(dateStr)) {
      setCheckedDates(checkedDates.filter(d => d !== dateStr));
    } else {
      setCheckedDates([...checkedDates, dateStr]);
    }
  };

  const getProgressPercentage = () => {
    return Math.round((daysCompleted / totalDays) * 100);
  };

  const handleReset = () => {
    if (confirm("Tem certeza que deseja desmarcar todos os dias?")) {
      setCheckedDates([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      {/* Header Fixo */}
      <div className="bg-blue-600 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="w-8 h-8" />
              Rumo à Casa Nova
            </h1>
            <button 
              onClick={handleReset}
              className="text-xs text-blue-200 hover:text-white flex items-center gap-1 bg-blue-700 px-3 py-1 rounded-full transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Resetar
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-blue-700/50 p-4 rounded-xl border border-blue-500/30">
            <div className="text-center md:text-left">
              <p className="text-blue-200 text-sm font-medium uppercase tracking-wider">Data da Mudança</p>
              <p className="text-xl font-bold">{formatFullDate(targetDate)}</p>
            </div>
            
            <div className="text-center">
              <p className="text-4xl font-black">{realDaysRemaining}</p>
              <p className="text-blue-200 text-sm">Dias Restantes</p>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="mt-6">
            <div className="flex justify-between text-xs mb-1 text-blue-100">
              <span>Jornada Percorrida</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-blue-900/40 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-green-400 h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Dias */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-slate-500">
          <Calendar className="w-5 h-5" />
          <h2 className="font-semibold">Seu Checklist Diário</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {allDays.map((date, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const isChecked = checkedDates.includes(dateStr);
            const isTarget = date.getTime() === targetDate.getTime();
            const isToday = new Date().toDateString() === date.toDateString();
            
            // Estilo especial para o dia da mudança
            if (isTarget) {
              return (
                <div 
                  key={dateStr}
                  className={`
                    col-span-3 sm:col-span-4 md:col-span-6 
                    bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                    p-6 rounded-xl shadow-lg flex items-center justify-center gap-4
                    mt-4 transform hover:scale-105 transition-transform duration-300
                  `}
                >
                  <Home className="w-10 h-10 animate-bounce" />
                  <div className="text-center">
                    <p className="font-bold text-2xl">Dia da Mudança!</p>
                    <p className="opacity-90">{formatDate(date)}</p>
                  </div>
                  <PartyPopper className="w-10 h-10 animate-bounce" />
                </div>
              );
            }

            return (
              <button
                key={dateStr}
                onClick={() => toggleDate(dateStr)}
                className={`
                  relative p-3 rounded-lg border-2 flex flex-col items-center justify-center gap-2
                  transition-all duration-200 h-24
                  ${isChecked 
                    ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:shadow-md'
                  }
                  ${isToday && !isChecked ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                `}
              >
                {isToday && !isChecked && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                    Hoje
                  </span>
                )}
                
                <span className="text-sm font-medium">{formatDate(date)}</span>
                
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-colors
                  ${isChecked ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-300'}
                `}>
                  {isChecked ? <Check className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                </div>

                {isChecked && (
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                    Vencido
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}