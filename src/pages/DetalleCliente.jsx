import '../css/detallecliente.css'
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
 
const DetalleCliente = () => {
 const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/users/${id}`)
      .then((res) => res.json())
      .then((data) => setCliente(data));
  }, [id]);

  const confirmarEliminacion = async () => {
    setMostrarModal(false);
    try {
      const respuesta = await fetch(
        `https://fakestoreapi.com/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (respuesta.ok) {
        setMensaje("Cliente eliminado correctamente");

        setTimeout(() => {
          navigate("/clientes");
        }, 2000);
      }
    } catch (error) {
      setMensaje("Error al eliminar cliente");
    }
  };

  if (!cliente) {
    return <h2>Cargando cliente...</h2>;
  }

  return (
    <div className="detalle-cliente">
      <h1>Ficha del Cliente</h1>
      <p>Rol actual: {role}</p>

      {mensaje && <p className='mensaje-eliminado'>{mensaje}</p>}

      <p>
        <strong>ID:</strong> {cliente.id}
      </p>

      <p>
        <strong>Nombre:</strong>{" "}
        {cliente.name.firstname} {cliente.name.lastname}
      </p>

      <p>
        <strong>Email:</strong> {cliente.email}
      </p>

      <p>
        <strong>Telefono:</strong> {cliente.phone}
      </p>

      <h2>Direccion</h2>

      <p>
        <strong>Calle:</strong> {cliente.address.street}
      </p>

      <p>
        <strong>Numero:</strong> {cliente.address.number}
      </p>

      <p>
        <strong>Codigo Postal:</strong> {cliente.address.zipcode}
      </p>

      <p>
        <strong>Ciudad:</strong> {cliente.address.city}
      </p>

      <h2>Credenciales</h2>

      <p>
        <strong>Usuario:</strong> {cliente.username}
      </p>

      <p>
        <strong>Contrasena:</strong> {cliente.password}
      </p>

      {role?.trim() === "Gerencia" && (
        <button className='btn-eliminar' onClick={() => setMostrarModal(true)}>
          Eliminar Cliente
        </button>
      )}

      {mostrarModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3>Confirmar eliminacion?</h3>
            <p>Estas seguro de que deseas eliminar a <strong>{cliente.name.firstname} {cliente.name.lastname}</strong>? Esta acción no se puede deshacer.</p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
              <button 
                onClick={() => setMostrarModal(false)}
                style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminacion}
                style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Si, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleCliente;