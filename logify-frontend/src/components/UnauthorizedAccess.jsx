const UnauthorizedAccess= ()=>{
    return(
        <div>
            
            <h1>403</h1>
            <h3>Forbidden</h3>
            <p> Access to the requested resource is forbidden.</p>
            <button onClick={() => (window.location.href = '/home')}>Go to Home</button>

        </div>
    )
}
export default UnauthorizedAccess;