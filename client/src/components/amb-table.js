import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

function AmbTable(props) {
  let navigate = useNavigate();
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Amb Name</th>
          <th>Creator</th>
        </tr>
      </thead>
      <tbody>
        {
          props.ambList.map((ambInfo) => {
            return (
              <tr
                key={ambInfo.id}
                onClick={() => navigate(`/amb/${ambInfo.id}`)}
              >
                <td>{ambInfo.id}</td>
                <td>{ambInfo.name}</td>
                <td>{ambInfo.owner_name}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  );
}

export default AmbTable;
