import requests
import json

## Swiftly API URLS
routes_url = 'http://api.transitime.org/api/v1/key/dca04420/agency/san-joaquin/command/routes?format=json'
route_details_url = 'http://api.transitime.org/api/v1/key/dca04420/agency/san-joaquin/command/routesDetails?r='
times_vert_url = 'http://api.transitime.org/api/v1/key/dca04420/agency/san-joaquin/command/scheduleVertStops?r='
times_hori_url = 'http://api.transitime.org/api/v1/key/dca04420/agency/san-joaquin/command/scheduleHorizStops?r='

file_type = '.json'
routes = []


## Gets list of routes currently in service
list_data = requests.get(routes_url).json()
with open ('/Users/Macbook/Documents/RTD/departureScreen/json/route_list/routes.json', 'w') as route_list_file:
    route_list_file.write(json.dumps(list_data, indent = 4))

## Gets all current Route IDs from 'routes_url' and appends to routes array
get_routes = requests.get(routes_url).json()
for route_id in get_routes['routes']:
    routes.append(route_id['id'])

## Loops through routes array to read and write JSON files for each route using URLS given
for route in routes:
    
    ## For route details
    route_details = requests.get(route_details_url + route + '&format=json')
    route_data = route_details.json()
    with open('/Users/Macbook/Documents/RTD/departureScreen/json/route_details/' + route + file_type, 'w') as route_detail_file:
        route_detail_file.write(json.dumps(route_data, indent = 4)) 
    
    ## For vertical timetable 
    times_vert = requests.get(times_vert_url + route + '&format=json') 
    vert_data = times_vert.json()
    with open('/Users/Macbook/Documents/RTD/departureScreen/json/times_vert/' + route + file_type, 'w') as times_vert_file:
        times_vert_file.write(json.dumps(vert_data, indent = 4))
    
    ## For horizontal timetable
    times_hori = requests.get(times_hori_url + route + '&format=json') 
    hori_data = times_hori.json()
    with open('/Users/Macbook/Documents/RTD/departureScreen/json/times_hori/' + route + file_type, 'w') as times_hori_file:
        times_hori_file.write(json.dumps(hori_data, indent = 4))