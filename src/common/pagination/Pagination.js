import React from 'react';
import './pagination.css'
import _ from 'lodash';



export default function Pagination(props){
    let {pageSize, itemsCount, onPageChange, currentPage, MaxPage, MinPage, handleNextbtn, handlePrevbtn}= props;
  
    const pageCount = itemsCount/pageSize;
    const pages =_.range(1, pageCount+1);
    
    const renderPageNumbers =  pages.map((page, index)  =>{
       
       if (page < MaxPage + 1 && page > MinPage){
            return (
            <li key ={index} style={{cursor:"pointer"}} className = {page === currentPage? 'page-item active':'page-item'}>
            <a className = "page-link" onClick={()=>onPageChange(page) }>{page}</a>
            </li>);
       }
       else 
           return null;
            });  
   
   
   return ( 
            <div className = "container1" >
           <nav aria-label="pagination">
               <ul className = "pagination" >
               <li><button className= "btn-last  btn-success" onClick={handlePrevbtn} style={{cursor:'pointer'}} disabled={currentPage == pages[0] ? true : false}>{'<'}</button></li>  
               {renderPageNumbers}
               <li><button className= "btn-last  btn-success" onClick={handleNextbtn} disabled={currentPage == pages[pages.length - 1] ? true : false}>{'>'}</button></li>         
              </ul>
           </nav>
           </div> 
         );
}