// PageHeader component representing breadcrumbs and title
// This component is used in various pages to display the current page title and breadcrumb navigation
import React from 'react'
import { Link } from 'react-router-dom'
import './PageHeader.css'

const PageHeader = ({title, curPage}) => {
  return (
    <div className="pageheader-main">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="pageheader-content text-align-center text-center">
                            <h2><b>{title}</b></h2>
                            <nav aria-label="breadcrumb text-white">
                                <ol className="breadcrumb justify-content-center text-white">
                                    <li className="breadcrumb-item"><Link className="link " to="/">Home</Link></li>
                                    {curPage === 'Register' && (
                                        <li className="breadcrumb-item"><Link className="link" to="/Login">Login</Link></li>
                                    )}
                                    {curPage === 'Announcements' && (
                                        <li className="breadcrumb-item"><Link className="link" to="/Login">Login</Link></li>
                                    )}
                                    {curPage === 'Checkout' && (
                                        <li className="breadcrumb-item"><Link className="link " to="/classes">Classes</Link></li>
                                    )}
                                    <li className="breadcrumb-item active" style={{color: 'var(--color-text)'}} aria-current="page text-white">{curPage}</li>                                    
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
export default PageHeader