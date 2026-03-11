
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-4 px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex flex-wrap justify-center items-center gap-y-3 md:gap-x-6 text-center md:text-right mb-4">
          
          {/* GEMOPS */}
          <div className="flex flex-col items-center md:items-end border-slate-100 md:border-r md:pr-6 last:border-none">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">GEMOPS</h4>
            <p className="text-[8px] text-slate-400 font-medium leading-tight">Gerência de Modernização e <br className="hidden md:block" /> Governança de Produtos e Software</p>
          </div>

          {/* GEINOVA */}
          <div className="flex flex-col items-center md:items-end border-slate-100 md:border-r md:pr-6 last:border-none">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">GEINOVA</h4>
            <p className="text-[8px] text-slate-400 font-medium leading-tight">Gerência de Inovação <br className="hidden md:block" /> em Serviços Digitais</p>
          </div>

          {/* SSI */}
          <div className="flex flex-col items-center md:items-end border-slate-100 md:border-r md:pr-6 last:border-none">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">SSI</h4>
            <p className="text-[8px] text-slate-400 font-medium leading-tight">Superintendência de <br className="hidden md:block" /> Sistemas e Inovação</p>
          </div>

          {/* STI */}
          <div className="flex flex-col items-center md:items-end border-slate-100 md:border-r md:pr-6 last:border-none">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">STI</h4>
            <p className="text-[8px] text-slate-400 font-medium leading-tight">Subsecretaria de Tecnologia <br className="hidden md:block" /> e Informação</p>
          </div>

          {/* SGG */}
          <div className="flex flex-col items-center md:items-end border-slate-100 md:border-r md:pr-6 last:border-none">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">SGG</h4>
            <p className="text-[8px] text-slate-400 font-medium leading-tight">Secretaria-Geral <br className="hidden md:block" /> de Governo</p>
          </div>

          {/* GOV GO Logo Image */}
          <div className="flex items-center pl-4">
            <img 
              src="https://www.cultura.go.gov.br/images/logo_governo_goias.png" 
              alt="Logo Governo de Goiás" 
              className="h-9 w-auto object-contain opacity-80 grayscale hover:grayscale-0 transition-all duration-300"
              onError={(e) => {
                // Fallback robusto se o link principal falhar
                (e.target as HTMLImageElement).src = "https://www.goias.gov.br/images/logos/logo_governo_goias_horizontal.png";
              }}
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-[9px] text-slate-400 font-medium">Governo do Estado de Goiás @ 2025. Todos os direitos reservados.</p>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <div className="h-px w-4 bg-slate-100"></div>
            <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.2em]">Versão: v1.1.1</p>
            <div className="h-px w-4 bg-slate-100"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};
