import axios from 'axios';
import deleteIcon from '../delete-icon.svg';
import editIcon from '../edit-icon.svg';
import React, { useEffect, useState } from 'react';
import Pagination from '../common/pagination/Pagination';
import Modal from 'react-modal';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserTable.css'
const UserTable =()=>{

    const [userData, setUserData] = useState([])
    const [MaxPage, setMaxPage] = useState(10);
    const [MinPage, setMinPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [itemsCount, setItemsCount] = useState(0);
    const [pageNumberLimit, setPageNumberLimit] = useState(10);
    const [renderItems,setRenderItems] = useState([])
    const [selectedRow, setSeletedIndex] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const [currentEditing, setCurrentEditing]= useState([])
    const [searchVal, setSearchVal] = useState([])
    const [searchData, setSearchData] = useState([])
    const [searching, isSearching] = useState(false)
    const [isMobile, checkIfMobile]=  useState(false)
    const customStyles = {
        content: {
          top: '40%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: !isMobile?"65%%":"65%%",
          overflow:"none"
        },
      };
    useEffect(()=>{
        getUserDetails()
        if(window.screen.width<767){
            checkIfMobile(true)
        }
    },[])

    useEffect(()=>{
        if(!searching){
        const pageCount= Math.ceil(userData.length)
        setItemsCount(userData.length)
        const arr= userData.filter((item,index)=> index>=(currentPage-1)*10 && index<currentPage*10)
        setRenderItems(arr)
    }
    },[userData, currentPage,searching])

    useEffect(()=>{
        if(searching){
        const pageCount= Math.ceil(searchData.length)
        setItemsCount(searchData.length)
        const arr= searchData.filter((item,index)=> index>=(currentPage-1)*10 && index<currentPage*10)
        setRenderItems(arr)
    }
    },[searching,searchData])

    const getUserDetails=()=>{
        axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json').then(res=>{
                setUserData(res.data)
        })
    }

    const handlePrevbtn = () => {
        setCurrentPage(currentPage - 1);
        if ((currentPage - 1) % pageNumberLimit == 0) {
          setMaxPage(MaxPage - pageNumberLimit);
          setMinPage(MinPage - pageNumberLimit);
        }
      };

      const handleNextbtn = () => {
        setCurrentPage(currentPage + 1);
        if (currentPage + 1 > MaxPage) {
          setMaxPage(MaxPage + pageNumberLimit);
          setMinPage(MinPage + pageNumberLimit);
        }
      }
      const onPageChange = page =>{
        setCurrentPage(page);
    }
    const deleteMember=(item)=>{
        const updatedArr= _.cloneDeep(userData)
       const index= updatedArr.map((subItem,index)=>{
        if(subItem.id==item.id){
            return index
        }
       })
       updatedArr.splice(index, 1);
       toast.success("Deleted Successfully");
       setUserData(updatedArr)
      
    }
    useEffect(()=>{
        if(searching){
            searchItems(searchVal) 
        }
    },[userData])
    
    const editMember=(item)=>{
        var x= _.cloneDeep([item]);
        setCurrentEditing(x)
        setIsOpen(true)
    }

    const EditItems=(e)=>{
        const name= e.target.name
        const val = e.target.value
        const data = [...currentEditing]
        data[0][name]= val
        setCurrentEditing(data)
    }
    const SaveEdit=()=>{
        const x=  _.cloneDeep([...userData]);
        const updatedArr= x.map(item=>{
            if(item.id==currentEditing[0].id){
                item=currentEditing[0]
            }
            return item
        })
        toast.success("Edited Successfully");
        setUserData(updatedArr)
        setIsOpen(false)
    }

    const SelectRow=(id,e)=>{
        let x=[...selectedRow]
        if(!e.target.checked){
            const index = x.indexOf(id);
             x.splice(index, 1);
        }
        else{
            x.push(id)
        }
         setSeletedIndex(x)
    }

    const selectAll=(e)=>{
        if(!e.target.checked){
            setSeletedIndex([])
        }
        else{
        const allRows= renderItems.map(item=>{
            return item.id
        })
        setSeletedIndex(allRows)
        }
    }
    const deleteSelected=()=>{
        if(selectedRow.length>0){
            let deleteMultiple=[...userData]
            const x=[...selectedRow]
            x.forEach(item=>{
                deleteMultiple= deleteMultiple.filter(subItem=> subItem.id!==item ) 
            })
            toast.success("Deleted Successfully");
            setUserData(deleteMultiple)
        }
        else{
            toast.error('No User Selected')
        }
    }

    function afterOpenModal() {
        console.log('hi')
      }
      function closeModal() {
        setIsOpen(false);
      }
    
      const searchItems=(e)=>{
        const search= e.target? e.target.value:searchVal
        setSearchVal(search)
        const searchData= _.cloneDeep([...userData]);
        if(search){
            const arr= searchData.filter(item=>item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase()) || item.role.toLowerCase().includes(search.toLowerCase()))
            setSearchData(arr)
            isSearching(true)
        }
        else{
            isSearching(false)
        }
      }
    return (
        <React.Fragment>
       <ToastContainer
      />
       <div className='container usertable'>
         
      {modalIsOpen?<Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Example Modal"
      >
         <div className='row text-center'>
         <div className='col-12'>
            <p>Name: <input value={currentEditing[0].name} name="name" onChange={(e)=>EditItems(e)}/></p>
            <p>Email: <input name="email" onChange={(e)=>EditItems(e)} value={currentEditing[0].email}/></p>
            <p>Role: <input name="role" onChange={(e)=>EditItems(e)} value={currentEditing[0].role}/></p>
         </div>
       </div>
       <div className='row text-center'>
         <div className='col-6'>
         <button onClick={SaveEdit} className= "btn btn-success">Save</button>
         </div>
         <div className='col-6'>
         <button onClick={closeModal} className= "btn btn-danger">No</button>
         </div>
       </div>
      </Modal>:null}

        <div className='row'>
            <div className='col-12'>
                <input type='text' value={searchVal} onChange={(e)=>searchItems(e)} className='searchBox' placeholder='Search by name,email or role'/>
            </div>
        </div>
        <div className='row'>
            <div className='col-12'>
                <table>
                    <thead>
                    <tr>
                        <th style={{minWidth:'150px'}}><input type="checkbox" onChange={(e)=>selectAll(e)} checked={selectedRow.length==renderItems.length} style={{marginRight:'10px'}}/>Select All</th>
                        <th style={{minWidth:'150px'}}>Name</th>
                        <th style={{minWidth:'150px'}}>Email</th>
                        <th style={{minWidth:'150px'}}>Role</th>
                        <th style={{minWidth:'150px'}}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderItems.length>0?renderItems.map((item,index)=>{
                        return(
                          <tr key={item.id} style={selectedRow.includes(item.id)?{backgroundColor:'#dee2e6'}:null}>
                          <td><input type="checkbox" checked={selectedRow.includes(item.id)} onChange={(e)=>SelectRow(item.id,e)}/></td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.role}</td>
                          <td><img onClick={()=>editMember(item)} src={editIcon}/> <img width='30px' onClick={()=>deleteMember(item)} src={deleteIcon}/></td>
                      </tr>
                      )
                    }):null}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="row" style={{display:"flex", justifyContent:"center"}}>
        <div className='col-12'>
            <button className='btn' onClick={deleteSelected}>Delete Selected</button>
            </div>
            <div className='col-12'>
        <Pagination
             pageSize={pageSize}
             itemsCount={itemsCount}
             currentPage={currentPage}
             onPageChange={onPageChange}
             MinPage={MinPage}
             MaxPage={MaxPage}
             handlePrevbtn={handlePrevbtn}
             handleNextbtn={handleNextbtn}
             />
             </div>
        </div>
       </div>
       </React.Fragment>
    )
}

export default UserTable