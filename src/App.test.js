import { render, screen, cleanup } from '@testing-library/react'
import axiosMock from 'axios'
import App from './App'
import Map from './components/Map'
import Form from './components/Form'
import userEvent from '@testing-library/user-event'

afterEach(cleanup)

test('Renders App component', () => {
  const { asFragment } = render(<App />)
  expect(asFragment(<App />)).toMatchSnapshot()
})

test('Renders Map component', () => {
  const { asFragment } = render(<Map />)
  expect(asFragment(<Map />)).toMatchSnapshot()
})

test('Renders Form component', () => {
  const { asFragment } = render(<Form />)
  expect(asFragment(<Form />)).toMatchSnapshot()
})

test('Display a loading text', () => {
  const { getByTestId } = render(<Map />)
  expect(getByTestId('loading')).toHaveTextContent('Loading...')
})

test('Display a no routes available text', () => {
  const { getByTestId } = render(<Form />)
  expect(getByTestId('noRoutes')).toHaveTextContent('No routes available')
})

