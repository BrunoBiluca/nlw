import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Map, TileLayer, Marker } from 'react-leaflet'
import axios from 'axios'

import './style.css'

import api from '../../api/api'
import { LeafletMouseEvent } from 'leaflet'
import { useHistory } from 'react-router-dom'

interface Item {
    id: number
    image_url: string
    title: string
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

const CreatePoint = () => {

    const history = useHistory()

    const logo = require('../../assets/logo.svg')

    const [items, setItems] = useState<Item[]>([])

    const [ufs, setUfs] = useState<IBGEUFResponse[]>([])
    const [selectedUf, setSelectedUf] = useState("")

    const [cities, setCities] = useState<IBGECityResponse[]>([])
    const [selectedCity, setSelectedCity] = useState("")

    const [inititalPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])

    const [formInput, setFormInput] = useState({
        name: '',
        email: ''
    })

    const [selectedItems, setSelectedItems] = useState<number[]>([])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
            setSelectedPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then(response => {
                setUfs(response.data)
            })
    }, [])

    useEffect(() => {
        if (selectedUf === '') return

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                setCities(response.data)
            })
    }, [selectedUf])

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="" />
                <a>
                    <FaArrowLeft color="#34CB79" />
                    <strong>Voltar para a home</strong>
                </a>
            </header>
            <form>
                <h1>Cadastro do <br /> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados da entidade</h2>
                    </legend>

                    <div className="field">
                        <legend>
                            <span>Nome da entidade</span>
                        </legend>
                        <input type="text" name="name" id="name"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setFormInput({ ...formInput, name: event.target.value })}
                        />
                    </div>

                    <div className="field">
                        <legend>
                            <span>Email</span>
                        </legend>
                        <input type="text" name="email" id="email"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setFormInput({ ...formInput, email: event.target.value })}
                        />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span></span>
                    </legend>

                    <Map center={inititalPosition} zoom={13}
                        onclick={(event: LeafletMouseEvent) => {
                            setSelectedPosition([event.latlng.lat, event.latlng.lng])
                        }}
                    >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <legend>
                                <span>Estado</span>
                            </legend>
                            <select
                                name="uf"
                                id="uf"
                                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                                    setSelectedUf(event.target.value)
                                }}
                            >
                                {ufs.map(uf =>
                                    <option key={uf.sigla} value={uf.sigla}>{uf.sigla}</option>
                                )}

                            </select>
                        </div>

                        <div className="field">
                            <legend>
                                <span>Cidade</span>
                            </legend>
                            <select name="city" id="city"
                                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                                    setSelectedCity(event.target.value)
                                }}
                            >
                                {cities.map(city =>
                                    <option key={city.nome} value={city.nome}>{city.nome}</option>
                                )}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend><h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <div className="field">
                        <ul className="items-grid">
                            {items.map(item =>
                                <li key={item.id} className={selectedItems.includes(item.id) ? 'selected' : ''}
                                    onClick={() => {
                                        if (selectedItems.includes(item.id)) {
                                            setSelectedItems(selectedItems.filter(i => i != item.id))
                                        }
                                        else {
                                            setSelectedItems([...selectedItems, item.id])
                                        }
                                    }}
                                >
                                    <img src={item.image_url} alt="Lâmpadas" />
                                    <span>{item.title}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </fieldset>

                <button type="submit"
                    onClick={ async (event: FormEvent) => {
                        event.preventDefault()

                        const point = {
                            name: formInput.name,
                            email: formInput.email,
                            latitude: selectedPosition[0],
                            longitude: selectedPosition[1],
                            city: selectedCity,
                            uf: selectedUf,
                            items: selectedItems
                        }

                        await api.post('points', point)

                        history.push('/')
                    }}
                >Cadastrar ponto de coleto</button>

            </form>
        </div>
    )
}
export default CreatePoint