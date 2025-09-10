
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface RobotIdCardProps {
  image: string;
  info: { [key: string]: string };
  title: string;
}

const RobotIdCard: React.FC<RobotIdCardProps> = ({ image, info, title }) => {
  const { t, direction } = useLocalization();

  const translations = {
      cardTitle: { fr: "Carte d'Identité", en: "Identity Card", ar: "بطاقة الهوية" }
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure><img src={image} alt={title} className="w-full h-48 object-cover" /></figure>
      <div className="card-body">
        <h2 className="card-title">{t(translations.cardTitle)}</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <tbody>
              {Object.entries(info).map(([key, value]) => (
                <tr key={key}>
                  <th className={direction === 'rtl' ? 'text-right' : 'text-left'}>{key}</th>
                  <td className={direction === 'rtl' ? 'text-left' : 'text-right'}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RobotIdCard;