import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllUsers } from '../../redux/users';
import { Table, Button } from 'antd';

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
 
];

class Users extends Component {
  componentDidMount = () => this.props.getAllUsers()

  handleRefresh = () => this.props.getAllUsers()

  render() {
    const { data } = this.props
    return (
      <>
        <Button onClick={this.handleRefresh} type="primary">Refresh</Button>
        <h2>Users</h2>
        <Table columns={columns} rowKey={record => record.id} dataSource={data} size="middle" />
      </>
    )
  }
}

const mapStateToProps = state => ({
  data: state.clients.data
})

const mapDispatchToProps = {
  getAllUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)