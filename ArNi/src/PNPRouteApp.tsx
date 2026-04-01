// import React, { lazy, Suspense } from 'react';
// import { Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch

// // Lazy load the PNPHome component
// const PNPHome = lazy(() => import('./pages/PNPHome/PNPHome'));

// const PNPRouteApp = () => {
//     return (
//         <Suspense fallback={<div>Loading...</div>}>
//             <Routes>  {/* Replace Switch with Routes */}
//                 <Route path="/pnp/" element={<PNPHome />} /> {/* Route uses element instead of component */}
//                 <Route path="/pnp/home" element={<PNPHome />} /> {/* Route uses element instead of component */}
//             </Routes>
//         </Suspense>
//     );
// };

// export default PNPRouteApp;
