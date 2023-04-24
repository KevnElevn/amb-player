import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

function UserTable(props) {
  let navigate = useNavigate();
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        {
          props.userList.map((userInfo) => {
            return (
              <tr
                key={userInfo.id}
                onClick={() => navigate(`/userlist/${userInfo.id}`)}
              >
                <td>{userInfo.id}</td>
                <td>{userInfo.username}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  );
}

export default UserTable;
