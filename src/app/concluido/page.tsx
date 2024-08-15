export default function ConcluidoPage() {
  return (
    <div className="w-full h-screen bg-[#F5F5F5] center-col !justify-start">
      <div className="w-full h-[120px] bg-[#1FBB70] center-col">
        <h1 className="text-[#fff] font-bold text-[40px]">
          Obrigado por sua compra!
        </h1>
      </div>
      <div className="w-full h-full bg-[#fff] center-col py-5">
        <h2 className="text-[20px] font-bold text-center">
          Você irá receber um comprovante de compra no email da compra!
        </h2>
        <p className="text-[16px] text-center">
          Em breve, você receberá um e-mail com o comprovante de compra.
        </p>
      </div>
    </div>
  );
}
