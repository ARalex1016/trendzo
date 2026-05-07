import EsewaImg from "@/assets/Icons/esewa_icon.png";
import KhaltiImg from "@/assets/Icons/khalti_icon.png";
import BankImg from "@/assets/Icons/bank_icon.png";

export const EsewaIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={EsewaImg} {...props} />
);

export const KhaltiIcon = (
  props: React.ImgHTMLAttributes<HTMLImageElement>,
) => <img src={KhaltiImg} {...props} />;

export const BankIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={BankImg} {...props} />
);
