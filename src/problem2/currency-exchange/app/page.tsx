import Image from "next/image";
import ExchangeForm from "./ExchangeForm";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col max-w-[100vw] max-h-[100vh] overflow-hidden  items-center justify-center gap-4 p-4">
      <div className="absolute z-0 inset-auto h-[100vh] w-[1000px] scale-150 bg-blue-800 opacity-20 blur-3xl"></div>
      <div className="absolute z-0 inset-auto  h-[300px] w-[300px]  translate-x-full scale-150 bg-purple-300 opacity-20 blur-3xl"></div>
      <div className="space-y-2">
      <p className="text-center text-2xl md:text-5xl font-bold  whitespace-nowrap  pr-2">
        CURRENCY EXCHANGE
      </p>
      <p className="text-center text-md md:text-2xl whitespace-nowrappr-2">
       A Challenge By 99Tech
      </p>
      </div>
      <br/>

      <div
        className="w-full relative mx-auto  max-w-screen-sm flex items-center justify-center gap-2 flex-wrap"
      >


        <div className="flex relative  w-full items-center justify-center">
          <div className="relative w-full max-w-screen-sm">
            {/* <div className="absolute bottom-0 z-0 left-0 h-full w-[80%] bg-gradient-to-r from-[#F7F7F8] to-80% to-transparent" /> */}
            {/* <div className="pointer-events-none absolute -top-1 z-10 h-20 w-full bg-gradient-to-b from-white to-transparent" />
            <div className="pointer-events-none absolute -bottom-1 z-10 h-20 w-full bg-gradient-to-t from-white to-transparent" />
            <div className="pointer-events-none absolute -left-1 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute -right-1 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent" /> */}
            <div className="mx-auto bg-white/40 p-4 md:p-8 shadow-sm rounded-xl relative min-h-[150px]">
              <ExchangeForm/>
            </div>



          </div>



        </div>
      </div>
    </main >
  );
}
