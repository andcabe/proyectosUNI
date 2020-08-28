# coding: utf-8
'''
Created on 7 dec. 2018

@author: Andr�s Cabero Mata
'''

import os.path
from math import sqrt

def leerCodigo(rutaFichero):
    assert os.path.isfile(rutaFichero), "No existe ese fichero."
    fichero = open(rutaFichero, "r")
    if fichero.mode == "r":
        texto = fichero.read()
    return texto

 
def escribirTexto(rutaFichero, codigo):
    fichero = open(rutaFichero, "w+")
    
    if fichero.mode == "w+":
        fichero.write(codigo)
        
alph = {"0000":0, "0010":1, "0100":2, "1000":3,
        "0011":4, "0110":5, "1100":6, "1011":7,
        "0101":8, "1010":9, "0111":10, "1110":11,
        "1111":12, "1101":13, "1001":14, "0001": 15}

revAlph = {v: k for k, v in alph.items()}

modos = {"cuerpo":1, "bit":2}

def suma(a, b):
    c = list(int(a[i]) ^ int(b[i]) for i in range(len(a)))
    return "".join(str(e) for e in c)


def mult(a, b, modo):
    assert modo in modos, "Las matrices tienen que estar entre estos tipos de codificación: " + str(modos)
    if modo == "cuerpo":
        if alph[a] != 0 and alph[b] != 0:
            if (alph[a] + alph[b]) % (len(alph) - 1) is 0:
                return revAlph[len(alph) - 1]
            else:
                return revAlph[(alph[a] + alph[b]) % (len(alph) - 1)]
        else:
            return revAlph[0]
    else:
        return (str(int(a) * int(b)))

def div(a, b, modo):
    assert modo in modos, "Las matrices tienen que estar entre estos tipos de codificación: " + str(modos)
    return mult(a, inversoCuerpo(b), modo) if modo == "cuerpo" else str(int(a) // int(b))
    
def productoMatrices(a, b, modo):
    assert len(a[0]) == len(b), "El número de columnas de la primera matriz tiene que ser igual al número de filas de la segunda."
    assert modo in modos, "Las matrices tienen que estar entre estos tipos de codificación: " + str(modos)
    c = []
    for i in range(len(a)):
        c.append([])
        for j in range(len(b[0])):
            add = revAlph[0] if modo == "cuerpo" else "0"
            for k in range(len(a[0])):
                add = suma(mult(a[i][k], b[k][j], modo), add)
            c[i].append(add)
    return c

def hexToBin(digito):
    return "{0:04b}".format(int(digito, 16))


def binToHex(digito):
    return hex(int(digito, 2))[2:]


def hexToBinBit(texto):
    c = []
    for i in range(len(texto)):
        p = hexToBin(texto[i])
        for j in range(len(p)):
            c.append(p[j])
    return c

    
def hexToBinCuerpo(texto):
    c = []
    for i in range(len(texto)):
        c.append(hexToBin(texto[i]))
        
    return c


def binBitToHex(bits):
    texto = ""
    for i in range(len(bits) // 4):
        texto = texto + binToHex(''.join(bits[i * 4:i * 4 + 4]))
    return texto

    
def binCuerpoToHex(cuerpo):
    texto = ""
    for i in range(len(cuerpo)):
        texto = texto + binToHex(cuerpo[i])
    return texto

     
def listaAMatriz(lista):
    tam = sqrt(len(lista))
    assert not tam - int(tam), "El tamaño de la lista tiene que ser un cuadrado perfecto (ej '16': 4*4)"
    tam = int(tam)
    m = []
    for i in range(tam):
        m.append(lista[i * tam:i * tam + tam]) 
    return m


def traspuestaMatriz(matriz):
    return [list(i) for i in zip(*matriz)]


def voltearFilasMatriz(matriz):
    m = []
    for i in range(len(matriz)):
        l = matriz[i][:]
        l.reverse()
        m.append(l)
        
    return m


def shiftFila(lista, n):
    n = n % len(lista)
    return lista[n:] + lista[:n]


def getMenorMatriz(matriz, i, j):
    return [row[:j] + row[j + 1:] for row in (matriz[:i] + matriz[i + 1:])]

def determinanteCofactores(cofactores, fila, modo):
    assert modo in modos, "Las matrices tienen que estar entre estos tipos de codificación: " + str(modos)
    determinante = revAlph[0] if modo == "cuerpo" else "0"
        
    for (c, a) in zip(cofactores, fila):
        determinante = suma(determinante, mult(c, a, modo))
    return determinante


def getDeterminanteMatriz(matriz, modo):
    assert modo in modos, "Las matrices tienen que estar entre estos tipos de codificación: " + str(modos)
    if len(matriz) == 2:
        return suma(mult(matriz[0][0], matriz[1][1], modo), mult(matriz[0][1], matriz[1][0], modo))
    
    c = []
    for j in range(len(matriz[0])):
        c.append(getDeterminanteMatriz(getMenorMatriz(matriz, 0, j), modo))
    return determinanteCofactores(c, matriz[0], modo)


def comprobarClave(clave):
    if len(clave) != 16:
        return False
    
    try:
        claveBits = hexToBinBit(clave)
        claveCuerpo = hexToBinCuerpo(clave)
    except:
        return False
    
    if getDeterminanteMatriz(listaAMatriz(claveBits[:4 * 4]), "bit") == "0":
        return False
    if getDeterminanteMatriz(listaAMatriz(claveBits[5 * 4:9 * 4]), "bit") == "0":
        return False
    
    if suma(suma(claveCuerpo[10], claveCuerpo[11]), suma(claveCuerpo[12], revAlph[1])) == revAlph[0]:
        return False
    if suma(suma(claveCuerpo[13], claveCuerpo[14]), suma(claveCuerpo[15], revAlph[1])) == revAlph[0]:
        return False
    
    return True

 
def comprobarTexto(texto):
    if len(texto) % 16:
        return False
    try:
        hexToBinCuerpo(texto)
        hexToBinBit(texto)
    except:
        return False
    
    return True
        

def inversoCuerpo(a):
    return revAlph[15 - alph[a]] if 15 - alph[a] != 0 else revAlph[15]

def getInversaMatriz(matriz, modo):
    determinante = getDeterminanteMatriz(matriz, modo)
    # Caso de matriz 2x2
    if len(matriz) == 2:
        return [[div(matriz[1][1], determinante, modo), div(matriz[0][1], determinante, modo)],
                [div(matriz[1][0], determinante, modo), div(matriz[0][0], determinante, modo)]]

    cofactores = []
    for i in range(len(matriz)):
        cofactorFila = []
        for j in range(len(matriz)):
            cofactorFila.append(div(getDeterminanteMatriz(getMenorMatriz(matriz, i, j), modo), determinante, modo))
        cofactores.append(cofactorFila)
    return traspuestaMatriz(cofactores)


def subBytesInv(texto, elementosClave):
    elementosClave = hexToBinBit(elementosClave)
    matriz = listaAMatriz(elementosClave[:4 * 4])
    sumador = elementosClave[4 * 4:5 * 4]
    matriz = voltearFilasMatriz(matriz)
    matriz = getInversaMatriz(matriz, "bit")
    for i in range(len(texto)):
        texto[i] = suma(texto[i], "".join(sumador))
        texto[i] = list(texto[i])
        texto[i].reverse()
        texto[i] = productoMatrices([texto[i]], matriz, "bit")[0]
        texto[i] = "".join(reversed(texto[i]))
        
    return texto

     
def shiftRowsInv(texto):
    shiftTexto = []
    for i in range(len(texto) // 16):
        t = listaAMatriz(texto[i * 16:i * 16 + 16])
        t = traspuestaMatriz(t)
        
        for i in range(len(t)):
            t[i] = shiftFila(t[i], -i)
            
        t = traspuestaMatriz(t)
        
        for row in t:
            for e in row:
                shiftTexto.append(e)
                
    return shiftTexto

def sumarClave(texto, clave):
    clave = hexToBinCuerpo(clave)
    textoSuma = []
    for i in range(len(texto) // 16):
        for (t, c) in zip(texto[i * 16:i * 16 + 16], clave):
            textoSuma.append(suma(t, c))
    return textoSuma

def mixColumnsInv(texto, elementosClave):
    assert len(elementosClave) == 3, "Los elementos de la clave para el tercer paso debe ser 3"
    elementosClave = hexToBinCuerpo(elementosClave)
    elementosClave.reverse()
    elementosClave.append(revAlph[15])
    matriz = [elementosClave[:]]  
    for i in range(len(elementosClave) - 1):
        matriz.append(shiftFila(matriz[i], -1))
    matriz = getInversaMatriz(matriz, "cuerpo")    
    mixTexto = []       
    for i in range(len(texto) // 16):
        t = listaAMatriz(texto[i * 16:i * 16 + 16])
        t = productoMatrices(t, matriz, 'cuerpo')
        for row in t:
            for e in row:
                mixTexto.append(e)
    
    return mixTexto


def decodificar(codigo, clave):
    codigo = hexToBinCuerpo(codigo)  # #Texto en binario
    codigo = mixColumnsInv(codigo, clave[13:])  # #Paso 7
    codigo = shiftRowsInv(codigo)  # #Paso 6
    codigo = subBytesInv(codigo, clave[5:10])  # #Paso 5
    codigo = sumarClave(codigo, clave)  # #Paso 4
    codigo = mixColumnsInv(codigo, clave[10:13])  # #Paso 3
    codigo = shiftRowsInv(codigo)  # #Paso 2
    codigo = subBytesInv(codigo, clave[:5])  # #Paso 1
    return binCuerpoToHex(codigo)

if __name__ == "__main__":
    
    # #Clave a usar
    while (True):
        try:
            clave = input("Introduce la clave en hexadecimal (ej: 0123456789abcdef): ")
            assert comprobarClave(clave), "Clave no valida"
            break
        except Exception as e:
            print("Introduzca de nuevo la ruta: " + str(e))
    
    # #Texto a codificar
    while(True):
        try:
            rutaCodigo = input("Introduce el fichero que contiene el codigo (ej: codigo.txt): ")
            codigo = leerCodigo(rutaCodigo)
            assert comprobarTexto(codigo), "Codigo no válido"
            break
        except Exception as e:
            print("Introduzca de nuevo la ruta: " + str(e))

    texto = decodificar(codigo, clave)
    print("Codigo a decodificar: " + codigo)
    print("Texto decodificado: " + texto)
    
    # #Fichero a escribir
    while(True):
        try:
            rutaTexto = input("Introduce el fichero para escribir el texto (ej: textoDecodificado.txt): ")
            escribirTexto(rutaTexto, texto)
            break
        except Exception as e:
            print("Introduzca de nuevo la ruta; " + str(e))
            
