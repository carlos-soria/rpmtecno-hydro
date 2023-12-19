import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import './FormularioReparacion.css';
import { Box, Button, Container, Grid, IconButton, InputAdornment, MenuItem, Modal, OutlinedInput, Paper, Select, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link } from 'react-router-dom';




export default function ListaServicios() {
  const [servicios, setServicios] = useState([]);
  const [estados, setEstados] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [tiposServicios, setTiposServicios] = useState([]);
  const [ordenBuscado, setOrdenBuscado] = useState('');
  const [tipoServicioFiltrado, setTipoServicioFiltrado] = useState('');
  const [fechaRecibidoFiltrado, setFechaRecibidoFiltrado] = useState('');
  const [estadoFiltrado, setEstadoFiltrado] = useState('');
  const [tecnicoFiltrado, setTecnicoFiltrado] = useState('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const handleEditEstado = async (id,nuevoEstado,nuevaFecha) => {
    try {
      const data = 
      {
        NumeroOrden:id,
        IdEstado:nuevoEstado,
        FechaFinalizado: ' '
      };

      console.log(data);

      await axios.put(`http://localhost:62164/api/servicio/ModificarEstado/${id}`, data);
      
      
      setServicios((prevServicios) => {
        return prevServicios.map((servicio) =>
          servicio.NumeroOrden === id
            ? { ...servicio, IdEstado: nuevoEstado }
            : servicio
        );
      });
    } catch (error) {
      console.error('Error al guardar el estado:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:62164/api/servicio');
        setServicios(response.data);

        const estadosResponse = await axios.get('http://localhost:62164/api/estadoservicio');
        setEstados(estadosResponse.data);

        const tiposSResponse = await axios.get('http://localhost:62164/api/tiposervicio');
        setTiposServicios(tiposSResponse.data);

        const tecnicosResponse = await axios.get('http://localhost:62164/api/empleado');
        setTecnicos(tecnicosResponse.data);

      } catch (error) {
        console.error('Error al obtener la lista de servicios y estados', error);
      }
    };

    fetchData();
  }, []);


  const buscador = (e) => {
    setOrdenBuscado(e.target.value)
    console.log(e)
  }

  const filtroTipoServicio = (e) => {
    setTipoServicioFiltrado(e.target.value);
  };

  const filtroFechaRecibido = (e) => {
    setFechaRecibidoFiltrado(e.target.value);
  };

  const filtroEstado = (e) => {
    setEstadoFiltrado(e.target.value);
  };

  const filtroTecnico = (e) => {
    setTecnicoFiltrado(e.target.value);
  };

  //Metodos de filtrado
  let resultado = []
  if (!ordenBuscado) {
    resultado = servicios
  } else {
    resultado = servicios.filter((dato) =>
      dato.NumeroOrden.toString().includes(ordenBuscado) ||
      dato.CICliente.toString().includes(ordenBuscado)

    )
  }

  if (tipoServicioFiltrado) {
    resultado = resultado.filter((dato) => dato.TipoServicio && tiposServicios.find((tipo) => tipo.IdTipoServicio === dato.TipoServicio)?.NombreServicio === tipoServicioFiltrado);
  }

  if (fechaRecibidoFiltrado) {
    resultado = resultado.filter((dato) => dato.FechaRecibido === fechaRecibidoFiltrado);
  }

  if (estadoFiltrado) {
    resultado = resultado.filter((dato) => dato.IdEstado && estados.find((estado) => estado.IdEstado === dato.IdEstado)?.Estado === estadoFiltrado);
  }

  if (tecnicoFiltrado) {
    resultado = resultado.filter((dato) => dato.Tecnico && tecnicos.find((tecnico) => tecnico.IdEmpleado === dato.Tecnico)?.NombreEmpleado === tecnicoFiltrado);
  }

  const handleDelete = (NumeroOrden) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      axios
        .delete(`http://localhost:62164/api/servicio/${NumeroOrden}`)
        .then((response) => {
          console.log("Registro eliminado con éxito.");
          setServicios(servicios.filter(servicio => servicio.NumeroOrden !== NumeroOrden));
        })
        .catch((error) => {
          console.error("Error al eliminar el registro:", error);
        });
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },

    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const mostrarDetallesServicio = (servicio) => {
    setServicioSeleccionado(servicio);
    handleOpen(); 
  };

  const editarServicio = (servicio) => {
 
    console.log('Mostrar detalles del servicio:', servicio);
  };

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  return (
    <TableContainer component={Paper}>
      <Container>
        <Typography variant='h4' sx={{ mb: 2 }}>Listado de Reparaciones</Typography>
        <Button href='/formularioOrden' variant="contained" color="success" startIcon={<AddCircleOutlineIcon />} size="small" sx={{ mb: 2 }}>Añadir</Button>
        <OutlinedInput value={ordenBuscado} onChange={buscador} placeholder="Buscar..." sx={{ mb: 2 }} fullWidth size="small"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          } />
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              sx={{ mb: 4 }}
              label='Tipo de Reparación'
              type="text"
              name="NombreServicio"
              size="small"
              fullWidth
              select
              value={tipoServicioFiltrado}
              onChange={filtroTipoServicio}
            >
              <MenuItem>
                Todos
              </MenuItem>
              <MenuItem value='Reparación PC'>
                Reparación PC
              </MenuItem>
              <MenuItem value='Reparación de celular'>
                Reparación de celular
              </MenuItem>
              <MenuItem value='Reparación de impresora'>
                Reparación de impresora
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              sx={{ mb: 4 }}
              label='Estado'
              type="text"
              name="IdEstado"
              size="small"
              fullWidth
              select
              value={estadoFiltrado}
              onChange={filtroEstado}
            >
              <MenuItem>
                Todos
              </MenuItem>
              <MenuItem value='Ingresado'>
                Ingresado
              </MenuItem>
              <MenuItem value='En proceso de reparación'>
                En proceso de reparación
              </MenuItem>
              <MenuItem value='Esperando repuesto'>
                Esperando repuesto
              </MenuItem>
              <MenuItem value='Reparación finalizada'>
                Reparación finalizada
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              sx={{ mb: 4 }}
              label='Técnico'
              type="text"
              name="Tecnico"
              size="small"
              fullWidth
              select
              value={tecnicoFiltrado}
              onChange={filtroTecnico}
            >
              <MenuItem>
                Todos
              </MenuItem>
              <MenuItem value='Reparador de PC'>
                Reparador de PC
              </MenuItem>
              <MenuItem value='Reparador de celular'>
                Reparador de celular
              </MenuItem>
              <MenuItem value='Reparador de impresoras'>
                Reparador de impresoras
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              sx={{ mb: 2 }}
              label='Fecha de Entrega'
              type="date"
              name="fechaRecibido"
              value={fechaRecibidoFiltrado}
              onChange={filtroFechaRecibido}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>

      </Container>

      <Table size="small">
        <TableHead >
          <TableRow >
            <StyledTableCell>Número de Orden</StyledTableCell>
            <StyledTableCell>Cliente</StyledTableCell>
            <StyledTableCell>Trabajo a Realizar</StyledTableCell>
            <StyledTableCell>Fecha Recibido</StyledTableCell>
            <StyledTableCell>Técnico</StyledTableCell>
            <StyledTableCell>Tipo Servicio</StyledTableCell>
            <StyledTableCell>Estado</StyledTableCell>
            <StyledTableCell>Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resultado.map(servicio => (
            <StyledTableRow key={servicio.NumeroOrden}>
              <StyledTableCell >{servicio.NumeroOrden}</StyledTableCell >
              <StyledTableCell >{servicio.CICliente}</StyledTableCell >
              <StyledTableCell >{servicio.TrabajoARealizar}</StyledTableCell >
              <StyledTableCell >{servicio.FechaRecibido}</StyledTableCell >
              <StyledTableCell >{servicio.Tecnico && tecnicos.find((empleado) => empleado.IdEmpleado === servicio.Tecnico)?.NombreEmpleado}</StyledTableCell >
              <StyledTableCell >{servicio.TipoServicio && tiposServicios.find((tiposervicio) => tiposervicio.IdTipoServicio === servicio.TipoServicio)?.NombreServicio}</StyledTableCell >


              <StyledTableCell>
                <Select size="small" variant="standard"
                  value={servicio.IdEstado}
                  onChange={(e) => handleEditEstado(servicio.NumeroOrden, e.target.value)}
                >
                  {estados.map((estado) => (
                    <MenuItem key={estado.IdEstado} value={estado.IdEstado}>
                      {estado.Estado}
                    </MenuItem>
                  ))}
                </Select>
              </StyledTableCell>
              <StyledTableCell>
                <Box>
                  <IconButton onClick={() => mostrarDetallesServicio(servicio)}>
                    <SearchIcon sx={{ paddingRight: '2px' }} />
                  </IconButton>
                  <Link to={`/detalleServicio/${servicio.NumeroOrden}`}>
                  <IconButton>                 
                    <EditIcon onClick={() => editarServicio(servicio)} sx={{ paddingRight: '2px' }} />
                  </IconButton>
                </Link>                  
                  <IconButton onClick={() => handleDelete(servicio.NumeroOrden)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </StyledTableCell>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={styleModal}>
                  <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    Detalles de la Órden
                  </Typography>
                  {servicioSeleccionado && (
                    <div>
                      <TextField label='Numero de Orden' defaultValue={servicioSeleccionado.NumeroOrden} size="small" variant="standard" InputProps={{
            readOnly: true,
          }} sx={{ mr: 20, mb: 2 }} />
                      <TextField label='Cliente' defaultValue={servicioSeleccionado.CICliente} size="small" variant="standard" InputProps={{
            readOnly: true,
          }} sx={{ mb: 2 }} />
                      <TextField label='Tipo de Equipo' defaultValue={servicioSeleccionado.TipoEquipo} size="small" variant="standard" InputProps={{
            readOnly: true,
          }} sx={{ mr: 20, mb: 2 }} />
                      <TextField label='Modelo' defaultValue={servicioSeleccionado.Modelo} size="small" variant="standard" InputProps={{
            readOnly: true,
          }} sx={{ mb: 2 }} />
                      <TextField label='Trabajo a Realizar' defaultValue={servicioSeleccionado.TrabajoARealizar} size="small" variant="standard" InputProps={{
            readOnly: true,
          }} sx={{ mr: 20 }} />
                      <TextField label='Tipo de Servicio' defaultValue={servicioSeleccionado.TipoServicio && tiposServicios.find((tiposervicio) => tiposervicio.IdTipoServicio === servicioSeleccionado.TipoServicio)?.NombreServicio} size="small" variant="standard" InputProps={{
            readOnly: true,
          }} sx={{ mb: 2 }} />
                      <TextField label='Fecha Recibido' defaultValue={servicioSeleccionado.FechaRecibido} size="small" variant="standard" InputProps={{
            readOnly: true,
          }} sx={{ mr: 20, mb: 2 }} />
                      <TextField label='Fecha Finalizado' defaultValue={servicioSeleccionado.FechaFinalizado} size="small" variant="standard" InputProps={{
            readOnly: true,
          }} sx={{ mb: 2 }} />
                      <TextField label='Tecnico' defaultValue={servicioSeleccionado.Tecnico && tecnicos.find((empleado) => empleado.IdEmpleado === servicioSeleccionado.Tecnico)?.NombreEmpleado} size="small" variant="standard" InputProps={{
            readOnly: true,
          }} sx={{ mr: 20, mb: 2 }} />
                      <TextField label='Precio: $' defaultValue={servicioSeleccionado.PrecioReparacion} size="small" variant="standard" InputProps={{
            readOnly: true,
          }} sx={{ mb: 2 }} />
                      <TextField label='Estado' defaultValue={servicioSeleccionado.IdEstado && estados.find((estado) => estado.IdEstado === servicioSeleccionado.IdEstado)?.Estado} size="small" variant="standard" InputProps={{
            readOnly: true,
          }} sx={{ mr: 20, mb: 2 }} />
                    </div>
                  )}
                </Box>
              </Modal>
            </StyledTableRow >
          ))}
        </TableBody>
      </Table >
    </TableContainer>


  );
}











