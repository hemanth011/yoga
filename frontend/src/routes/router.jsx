// import React from 'react'
// import { createBrowserRouter } from 'react-router-dom';
// import MainLayout from '../layout/MainLayout';
// import Homa from '../pages/Home/Homa';
// import Instructors from '../pages/instructors/Instructors';
// import Classes from '../pages/Classes/Classes';
// import Login from '../pages/user/Login';
// import Register from '../pages/user/register';
// import SingalClasses from '../pages/Classes/SingalClasses';
// const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <MainLayout/>,
//       children:
//       [
//         {
//             path:"/",
//             element:<Homa/>

//         },{
//           path:"/instructors",
//           element:<Instructors/>
//         },{
//           path:"classes",
//           element:<Classes/>
//         },{
//           path:"/login",
//           element:<Login/>
//         },{
//           path:"/register",
//           element:<Register/>
//         },{
//           path:"/classes/:id",
//           element:<SingalClasses/>,
//           loader:({params})=>fetch(`http://localhost:5000/classes${params._id}`)
//         }
//       ]
//     }
//   ]);
// export default router


// import React from 'react';
// import { createBrowserRouter } from 'react-router-dom';
// import MainLayout from '../layout/MainLayout';
// import Homa from '../pages/Home/Homa';
// import Instructors from '../pages/instructors/Instructors';
// import Classes from '../pages/Classes/Classes';
// import Login from '../pages/user/Login';
// import Register from '../pages/user/register';
// import SingalClasses from '../pages/Classes/SingalClasses';
// import DashboardLayout from '../layout/DashboardLayout';
// import Dashboard from '../pages/Dashboard/Dashboard';

// const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <MainLayout/>,
//       children: [
//         {
//           path:"/",
//           element:<Homa/>
//         },
//         {
//           path:"/instructors",
//           element:<Instructors/>
//         },
//         {
//           path:"/classes",
//           element:<Classes/>
//         },
//         {
//           path:"/login",
//           element:<Login/>
//         },
//         {
//           path:"/register",
//           element:<Register/>
//         },
//         {
//           path:"/classes/:id",
//           element:<SingalClasses/>,
//           loader: ({ params }) => {
//             const url = `http://localhost:5000/class/${params.id}`;
//             return fetch(url)
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
//                     }
//                     return response.json();
//                 })
//                 .catch(error => {
//                     console.error('There was a problem with the fetch operation:', error);
//                     return null; // Return null in case of an error
//                 });
//         }
//         }
//       ]
//     },{
//       path:"/dashboard",
//       element:<DashboardLayout/>,
//       children:[
//         {
//           path:true,
//           element:<Dashboard/>
//         }
//       ]
//     }
// ]);

// export default router;
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Homa from '../pages/Home/Homa';
import Instructors from '../pages/instructors/Instructors';
import Classes from '../pages/Classes/Classes';
import Login from '../pages/user/Login';
import Register from '../pages/user/register';
import SingalClasses from '../pages/Classes/SingalClasses';
import DashboardLayout from '../layout/DashboardLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import StudentCP from '../pages/Dashboard/student/StudentCP';
import EnrolledClasses from '../pages/Dashboard/student/Enroll/EnrolledClasses';
import SeletedClass from '../pages/Dashboard/student/SeletedClass';
import MyPaymentHistory from '../pages/Dashboard/student/payment/History/MyPaymentHistory';
import AsInstructor from '../pages/Dashboard/student/apply/AsInstructor';
import Payment from '../pages/Dashboard/student/payment/Payment';
import InstructorCP from '../pages/Dashboard/instructor/InstructorCP';
import AddClass from '../pages/Dashboard/instructor/AddClass';
import MyClasses from '../pages/Dashboard/instructor/MyClasses';
import MyPending from '../pages/Dashboard/instructor/MyPending';
import MyApproved from '../pages/Dashboard/instructor/MyApproved';
import AdminHpme from '../pages/Dashboard/Admin/AdminHpme';
import ManageClasses from '../pages/Dashboard/Admin/ManageClasses';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import UpdateUser from '../pages/Dashboard/Admin/UpdateUser';


const fetchWithErrorHandling = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
    }

    const text = await response.text();
    if (!text) {
      return null; // Return null if the response is empty
    }

    try {
      const data = JSON.parse(text);
      return data;
    } catch (jsonError) {
      throw new Error('Failed to parse JSON');
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null; // Return null in case of an error
  }
};

const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children: [
        {
          path: "/",
          element: <Homa/>
        },
        {
          path: "/instructors",
          element: <Instructors/>
        },
        {
          path: "/classes",
          element: <Classes/>
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/register",
          element: <Register/>
        },
        {
          path: "/classes/:id",
          element: <SingalClasses/>,
          loader: ({ params }) => {
            const url = `http://localhost:5000/class/${params.id}`;
            return fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    return null; // Return null in case of an error
                });
          }
        }
      ]
    },
    {
      path: "/dashboard",
      element: <DashboardLayout/>,
      children: [
        {
          index: true,
          element: <Dashboard/>
        }
        //student router
        ,{
          path:"student-cp",
          element:<StudentCP/>
        },
        {
          path:"enrolled-class",
          element:<EnrolledClasses/>
        },{
          path:"my-selected",
          element:<SeletedClass/>
        },{
          path:"my-payments",
          element:<MyPaymentHistory/>
        },{
          path:"apply-instructor",
          element:<AsInstructor/>
        },{
          path:"user/payment",
          element:<Payment/>
        },
        // instructor
        {
          path:"instructor-cp",
          element:<InstructorCP/>
        },
        {
            path: 'add-class',
            element: <AddClass/>
        },
        {
          path:"my-classes",
          element:<MyClasses/>
        },{
          path:"my-pending",
          element:<MyPending/>
        },
        {
          path:"my-approved",
          element:<MyApproved/>
        }
        // admin
                ,{
                  path:"admin-home",
                  element:<AdminHpme/>
                },{
                  path:"manage-users",
                  element:<ManageUsers/>
                  
                },{
                  path:"manage-class",
                  element:<ManageClasses/>
                }, {
                  path: "update-user/:id",
                  element: <UpdateUser />,
                  loader: ({ params }) => {
                    const url = `http://localhost:5000/users/${params.id}`;
                    return fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
                            }
                            return response.json();
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                            return null; // Return null in case of an error
                        });
                  }
                }
      ]

    }
]);

export default router;

