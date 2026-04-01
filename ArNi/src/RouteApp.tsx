import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch

//const PNPRouteApp = lazy(() => import('./PNPRouteApp'));

const RouteApp = () => {

    return (
        <Suspense fallback={<div>Loading...</div>}>
             <Routes>  {/* Replace Switch with Routes */}
                <Route path="/pnp/*"></Route>
             </Routes>
        </Suspense>
    )
}

export default RouteApp;