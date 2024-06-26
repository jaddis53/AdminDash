import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faBell,
  faCheck,
  faTrash,
  faHome,
  faUsers,
  faLayerGroup,
  faChartBar,
  faCog,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import api from "../util/Util";

import img from "../images/logo-removebg.png";
import NavBar from "../components/NavBar";

const Notifications = () => {
  const [businesses,setBusinesses]=useState([])
  const [reports,setReports]=useState([])
  const [notifications,setNotifications]=useState([])
  const [notificationList, setNotificationList] = useState([]);
  useEffect(()=>{
    getNotifications();
 

  },[setNotificationList])
  

 
  const getNotifications=async()=>{
    await fetchNewBusinesses();
    await fetchNewReports();

  }
  

  const fetchNewReports=async()=>{
    await api.get('report/fetch-new-reports')
    .then((res)=>{
      console.log(res.data.message)
      if(res.data.success){
        console.log('these r the new reports fetched: ',res.data.reports)
        setReports(res.data.reports)
        setNotifications((prevArray)=>[...prevArray,res.data.reports])
      }
    })
    .catch((error)=>{
      if(error){
        console.log('error in fetch new reports: ',error.message)
      }
    })

  }


  useEffect(()=>{
    mapNotifications();
  },[reports])






  const fetchNewBusinesses=async()=>{
    await api.get('business/fetch-new-businesses')
    .then((res)=>{
      console.log(res.data.message)
      if(res.data.success){
        console.log('these r the new businesses fetched: ',res.data.businesses)
        setBusinesses(res.data.businesses)
        setNotifications((prevArray)=>[...prevArray,res.data.businesses])
        
      }
    })
    .catch((error)=>{
      if(error){
        console.log('error in fetch new businesses: ',error.message)
      }
    })

  }

  const mapNotifications=()=>{
    

    console.log('im in map notifications')
    console.log(reports,businesses)
    let fetchedNotifications=[]
    console.log('these are notifications', notifications)
    notifications.map((notifs)=>{
      console.log("this is noti")
      notifs.map((notif)=>{
        fetchedNotifications.push(notif)        
      })      
    })
    console.log("these r fetched notifications ",fetchedNotifications)
    // setNotifications(fetchedNotifications)
    setNotificationList(fetchedNotifications)
  }
  



  // const notifications = [
  //   {
  //     id: 1,
  //     title: "New Business Registered",
  //     description: "Business XYZ has registered on the platform.",
  //     date: "2024-06-01",
  //     status: "unread",
  //   },
  //   {
  //     id: 2,
  //     title: "New Report",
  //     description: "A new report has been submitted.",
  //     date: "2024-06-02",
  //     status: "unread",
  //   },

  // ];

 

  const handleMarkAsRead = async(notification) => {
    const updatedNotifications = notificationList.map((notif) =>
      notif._id === notification._id
        ? { ...notif, status: "read" }
        : notif
    );

 

    if(notification.notif_type==="New Report"){
      const reportId=notification._id
      const status= notification.status
      await api.put('report/update-report-status',{reportId,status})
      .then((res)=>{
        console.log(res.data.message)
      })
      .catch((error)=>{
        if(error){
          console.log(error.message)
        }
      })
      
    }
    else if (notification.notif_type==="New Business"){
      const businessId=notification._id
      const status= notification.status

      await api.put('business/update-business-status',{businessId,status})
      .then((res)=>{
        console.log(res.data.message)
      })
      .catch((error)=>{
        if(error){
          console.log(error.message)
        }
      })
    }

    setNotificationList(updatedNotifications);
  };

  const handleDelete = (id) => {
    const updatedNotifications = notificationList.filter(
      (notification) => notification.id !== id
    );
    setNotificationList(updatedNotifications);
  };

  return (
    <div className="notification-container flex flex-col h-screen">
     <NavBar/>
      <div className="dashboard-content flex flex-1">
        <div className="sidebar w-72 p-4 shadow">
          <div className="side-menu">
            {" "}
            <h2 className="text-2xl font-bold my-5">Menu</h2>
            <ul>
              <li className="mb-4">
                <Link to="/" className="flex items-center text-xl">
                  <FontAwesomeIcon icon={faHome} className="text-xl mr-3" />
                  Home
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/UserManagement"
                  className="flex items-center text-xl"
                >
                  <FontAwesomeIcon icon={faUsers} className="text-xl mr-3" />
                  User
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/BusinessListing"
                  className="flex items-center text-xl"
                >
                  <FontAwesomeIcon
                    icon={faLayerGroup}
                    className="text-xl mr-3"
                  />
                  Categories
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/ProblemReports"
                  className="flex items-center text-xl"
                >
                  <FontAwesomeIcon icon={faChartBar} className="text-xl mr-3" />{" "}
                  Problem Reports
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/Notifications" className="flex items-center text-xl">
                  <FontAwesomeIcon icon={faBell} className="text-xl mr-3" />
                  Notifications
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/settings" className="flex items-center text-xl">
                  <FontAwesomeIcon icon={faCog} className="text-xl mr-3" />{" "}
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="dashboard-content-right flex flex-col flex-1 p-4 bg-orange-50">
          <div className="flex m-4 ml-5 items-center">
            <FontAwesomeIcon icon={faBell} className="text-xl mr-3" />
            <h1 className="font-bold text-2xl">Notifications</h1>
          </div>
          <div className="notifications-list mt-4">
            {notificationList.map((notification) => (
              <Link
                to={{
                  pathname: `/notifications/${notification._id}`,
                  state: { notification },
                }}

                // className="btn-view-detail p-2 bg-blue-500 text-white rounded"
              >
                <div
                  key={notification._id}
                  className="notification-item p-4 border-b bg-white rounded-lg shadow mb-4 flex justify-between"
                >
                  <div className="flex-col">
                    <h2 className="font-bold text-xl text-orange-500">
                      {notification.notif_type}
                    </h2>
                    <p>{notification.description}</p>
                    <p className="text-gray-500">{notification.date}</p>
                    <p
                      className={`status text-${
                        notification.status === "read" ? "green" : "red"
                      }-500 font-bold`}
                    >
                      {notification.status === "read" ? "Read" : "Unread"}
                    </p>
                  </div>
                  <div className="actions mt-2 flex">
                    {notification.status === "unread" ||
                      ("pending" && (
                        <button
                          className="btn-mark-read mr-2 p-2 bg-green-500 text-white rounded"
                          onClick={() => handleMarkAsRead(notification)}
                        >
                          <FontAwesomeIcon icon={faCheck} className="mr-1" />{" "}
                          Mark as Read
                        </button>
                      ))}

                    <button
                      className="btn-delete p-2 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(notification)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </Link>
            ))}
            {notificationList.length === 0 && (
              <p className="text-center mt-4">No notifications found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
