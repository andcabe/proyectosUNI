# coding: utf-8
'''
@author Andrés Cabero Mata
'''
from time import sleep
import math
espacio = 1
'''
    (Margen 40)
    mayorPalabra:   Calcula el valor de la
                    mayor palabra en un texto.
    
    Parámetros:     Texto: dado en forma de
                    lista compuesta de strings.
    
    Salida:         Numero de carácteres de la 
                    mayor palabra del texto. 
'''    


def mayorPalabra(texto):
    
    mayor = 0
    for palabra in texto:            
            if len(palabra) > mayor:
                mayor = len(palabra)
        
    return mayor

'''
    (Margen 50)
    tamTexto:       Devuelve los tamaños de una lista de Strings
    
    Parámetros:     Texto: Lista compuesta de Strings.
    
    Salida:         Tam: Lista de los tamaños de los Strings
'''

def tamTexto(texto):
    tam = []
    for i in range(len(texto)):
        tam.append(len(texto[i]))
    return tam

'''
    (Margen 35)
    imprimirTexto:     Imprime un texto por pantalla.
    
    Parámetros:        Texto: dado en forma de 
                       lista compuesta de strings.
    
'''      


def imprimirTexto(texto):
    
    for palabra in texto:
        
        if palabra != "\n":
            print(palabra, end=" ")
        
        else:
            print("")

'''
    (Margen 60)
    imprimirTextoSaltos:    Imprime un texto por pantalla, dados los saltos de linea
    
    Parámetros:             Texto: dado en forma de lista compuesta de strings
                   
                            Saltos: de linea en forma de lista con la posición
                            de la palabra tras la que se hace el salto de linea.
    
'''


def imprimirTextoSaltos(texto, saltos):
    
    pSalto = 0
    for i in range(len(texto)):
        print(texto[i], end=" ")
        if saltos[pSalto] == i:
            print("")
            pSalto += 1
        sleep(0.01)
        
'''
    (Margen 70)
    tablaCoste:     Construye la tabla(i, j) de costes de poner la sucesión de 
                    palabras de i a j. Dicho coste se define como la suma elevada 
                    al cuadrado de los espacios finales para completar la linea.
                    
                    Se calcula el coste por filas utilizando programación dinámica, 
                    almacenando la longitud la primera palabra de la linea y utilizando 
                    el valor para sumarlo con las siguientes palabras. Se añade en cada 
                    adición de palabras el caracter del espacio entre las palabras.
                    
                    Si una sucesión de palabras (i,j) es superior al límite o margen dado 
                    se evaluará como coste infinito, al igual que en el caso en el que 
                    no se pueda dar el orden de las palabras (sucesión (i,j) con i>j).
                    
    Parametros:     Texto: Lista compuesta de enteros, cada uno siendo el tamaño de cada palabra
                    
                    Margen: Límite de carácteres en cada linea de texto.
    
    Salida:         tam: Tabla(i,j) donde la posición de la tabla[i][j] indica el valor 
                    del coste de introducir la sucesion de palabras (i,j) en una linea.
'''


def tablaCoste(texto, margen):
    assert margen >= max(texto)
    tam = []
    for i in range(len(texto)):  # Se inicializa la tabla entera con
        tam.append([math.inf] * len(texto))  # todos los valores como infinito
        
        for j in range(i, len(texto)):  # sucesion de palabras (i,j); j>=i
            
            if(i == j):  # Caso en el que solo es una palabra
                tam[i][j] = texto[i]
                
            elif(tam[i][j - 1] + texto[j] + 1 <= margen):  # Caso en el que la sucesión (i,j)
                tam[i][j] = tam[i][j - 1] + texto[j] + 1  # cumple los requisitos
                
            if(tam[i][j] == math.inf):  # Si después de evaluar una sucesión (i,j) es infinito
                break  # todas las siguientes (i,j+x) lo serán y no se evaluan.
    
        
        for j in range(i, len(texto)):  # Convierte tamaños de lineas a coste.
            if(tam[i][j] == math.inf):
                break
            
            tam[i][j] = (margen - tam[i][j])**2
                    
    return tam

'''
    (Margen=70)
    menorCosteDinamico:        Calcula la sucesión de lineas de menor coste posible para un texto.
    
                               Para calcular la sucesión utiliza una tabla creada a priori 
                               costes(i,j) con los costes de cada linea (i,j) formada por 
                               las palabras de la i a la j. Con estos valores se crea una 
                               lista costes(j) donde cada j es el coste mínimo de poner 
                               las palabras [0,j]. Se utiliza Programación Dinámica para 
                               calcular los costes menores de cada (0,j), siendo costes(0) el 
                               poner la primera palabra y costes(j) el menor entre la linea 
                               entera (0,j) y la ruta de costes(i-1) + el coste de (i,j). 

                               Cada vez que se encuentra un mínimo en coste(j) se añade la 
                               palabra de inicio a una lista ruta(j), siendo ruta(j)=i, 
                               que significa que la menor ruta para llegar a la palabra 
                               j desde la primera palabra pasa por poner la linea (i,j). 
                               
                               Para encontrar los saltos de linea se busca en la lista 
                               ruta(j) el inicio de la linea ruta(j)=i, y se hace el mismo 
                               proceso con ruta(i)-1 hasta que i<0. Se guarda cada valor al 
                               principio de una nueva lista dando la lista con los saltos 
                               de linea indicados por la palabra tras la que se debe poner.   
   
    Parametros:                Costes:    Tabla de costes(i,j) con el coste de la
                               linea formada por la secuencia de palabras(i,j)

    Salida:                    Lista con la posicion de la palabra tras la que hay que poner saltos
                               de linea para conseguir la sucesión de lineas cuyo coste es el menor.
'''


def menorCosteDinamico(tcostes):
    coste = []
    ruta = []
    for j in range(len(tcostes)):
        minimo = tcostes[0][j]
        rutaAct = 0
        for i in range(1, j + 1):
            if (tcostes[i][j] + coste[i - 1]) <= minimo:
                    minimo = tcostes[i][j] + coste[i - 1]
                    rutaAct = i

        coste.append(minimo)
        ruta.append(rutaAct)
    saltos = []
    pos = len(ruta) - 1
    while pos>=0:
        saltos.append(pos)
        pos = ruta[pos] - 1
    
    saltos.reverse()
    return saltos

'''
    imprimirTabla:     Imprime una tabla de 2 dimensiones.
    
    Parámetros:        Tabla: Tabla a imprimir.
'''


def imprimirTabla(tabla):
    
    f=open("tablaCoste.txt", "w+")
    for i in range(len(tabla)):
        for j in range(len(tabla[0])):
            print(tabla[i][j], end="\t")
            f.write(str(tabla[i][j]) +"\t")
            
        print("\n")
        f.write("\n")

'''
    leerTexto:    Lee texto de un fichero
    
    Parámetros:    RutaFichero:    Ruta del fichero
    
    Salida:        Texto: Texto leido del fichero
'''

def leerTexto(rutaFichero):
    
    fichero=open(rutaFichero, "r")
    
    if fichero.mode == "r":
        texto = fichero.read()
    
    return texto

'''
    escribirTexto:    Escribe un texto en un fichero, dados unos saltos de línea
    
    Parámetros:    RutaFichero:    Ruta del fichero
                   Texto:    Texto a escribir en el fichero
                   Saltos:    Palabra tras la que van los saltos.
                   
'''
def escribirTexto(rutaFichero, texto, saltos):
    fichero = open(rutaFichero, "w+")
    pSalto=0
    if fichero.mode == "w+":
        for i in range(len(texto)):
            fichero.write(texto[i]+" ")
            if saltos[pSalto]==i:
                fichero.write("\n")
                pSalto+=1

while __name__=="__main__":
    try:
        texto = leerTexto(input("Introduce la ruta del fichero: ")).split()
        margen = int(input("Introduce margen: "))
    
        tamanos = tamTexto(texto)
    
        costes = tablaCoste(tamanos , margen)
        saltos = menorCosteDinamico(costes)

        print("-----------------------------")
        print("------------Texto------------")
        print(texto)
        print("-----------------------------")
        print("-------Tabla de costes-------")
        imprimirTabla(costes)
        print("-----------------------------")
        print("-------Saltos de linea-------")
        print(saltos)
        print("-----------------------------")
        print("-----------------------------")
        print("----------Resultado:---------")

        escribirTexto("resultado.txt", texto, saltos)
        imprimirTextoSaltos(texto, saltos)
        print("\n")
    
    except:
        print("No existe el fichero o el margen es menor que alguna palabra.")
