import { useCurrentDefinition } from '../../store/sessionStore';

export function ComplexityPanel() {
  const { time, space } = useCurrentDefinition().complexity;

  return (
    <table>
      <tbody>
        <tr>
          <th>Best</th>
          <td>{time.best}</td>
        </tr>
        <tr>
          <th>Average</th>
          <td>{time.average}</td>
        </tr>
        <tr>
          <th>Worst</th>
          <td>{time.worst}</td>
        </tr>
        <tr>
          <th>Space</th>
          <td>{space}</td>
        </tr>
      </tbody>
    </table>
  );
}
