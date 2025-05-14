import { useNavigate } from 'react-router';

import { type TypPatient } from '#src/stores/types';
import { formatFriendlyDate } from '#src/utils';

interface Props {
  patients: TypPatient[];
}

export function PatientsTable({ patients }: Props) {
  const navigate = useNavigate();

  const onClickPatient = (patientId: string) => () => navigate(`/my-patients/${patientId}`);

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/10 px-4">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Onboarded</th>
            <th className="px-4 py-2 text-left">Offboarded</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr className="cursor-pointer hover:bg-primary"
              key={patient.id}
              onClick={onClickPatient(patient.id)}
            >
              <td className="border-t px-4 py-2">
                {patient.givenName} {patient.familyName}
              </td>
              <td className="border-t px-4 py-2">
                {patient.email}
              </td>
              <td className="border-t px-4 py-2">
                {formatFriendlyDate(patient.onboardedAt)}
              </td>
              <td className="border-t px-4 py-2">
                {
                  patient.offboardedAt
                  ? formatFriendlyDate(patient.offboardedAt)
                  : ''
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
