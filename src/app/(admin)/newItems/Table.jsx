import { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import PageTitle from '../../../components/PageTitle';
import fetchWithAuth from '../../../globalFetch/fetch'; // Import the fetch function
import NoImg from "./assets/no.png"
import { useNavigate } from 'react-router-dom';
const Table = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate=useNavigate()

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetchWithAuth(
        `http://13.203.184.112:3000/api/admin/users?page=${page}&limit=10&search=${search}`
      );
      setUsers(response.data.users); // Adjust based on API response
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch on mount and when page/search changes
  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  return (
    <>
      <PageTitle title="Users Table" />
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between mb-3">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="form-control w-25"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="responsive-table-plugin">
                <div className="table-rep-plugin">
                  <div className="table-responsive" data-pattern="priority-columns">
                    <table id="users-table" className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Iqama Number</th>
                          <th>Member ID</th>
                          <th>Phone</th>
                          <th>Profile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((user, idx) => (
                            <tr key={idx} className='align-middle' onClick={()=>navigate(`/users/${user.id}`)}>
                              <td>{user.name}</td>
                              <td>{user.iqamaNumber}</td>
                              <td>{user.memberId}</td>
                              <td>{user.phoneNumber}</td>
                              <td >
                                {user.profileImage ? (
                                  <img
                                    src={`data:image/png;base64,${user.profileImage}`}
                                    alt="Profile"
                                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                                  />
                                ) : (
                                    <img
                                    src={NoImg}
                                    alt="Profile"
                                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                                  />
                            
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-primary"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  className="btn btn-primary"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Table;
