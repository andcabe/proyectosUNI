# coding: utf-8
'''
Created on 28 nov. 2018

@author: Andrés Cabero Mata
'''

import os.path
from math import sqrt

alph = {"0000":0, "0010":1, "0100":2, "1000":3,
        "0011":4, "0110":5, "1100":6, "1011":7,
        "0101":8, "1010":9, "0111":10, "1110":11,
        "1111":12, "1101":13, "1001":14, "0001": 15}

revAlph = {v: k for k, v in alph.items()}

modos = {"cuerpo":1, "bit":2}


def leerTexto(rutaFichero):
    assert os.path.isfile(rutaFichero), "No existe ese fichero."
    fichero = open(rutaFichero, "r")
    if fichero.mode == "r":
        texto = fichero.read()
    return texto

 
def escribirCodigo(rutaFichero, codigo):
    fichero = open(rutaFichero, "w+")
    
    if fichero.mode == "w+":
        fichero.write(codigo)


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
        
    
def subBytes(texto, elementosClave):
    elementosClave = hexToBinBit(elementosClave)
    matriz = listaAMatriz(elementosClave[:4 * 4])
    sumador = elementosClave[4 * 4:5 * 4]
    matriz = voltearFilasMatriz(matriz)
    for i in range(len(texto)):
        texto[i] = list(texto[i])
        texto[i].reverse()
        texto[i] = productoMatrices([texto[i]], matriz, "bit")
        texto[i] = suma("".join(reversed(texto[i][0])), "".join(sumador))
    return texto

def shiftRows(texto):
    shiftTexto = []
    for i in range(len(texto) // 16):
        t = listaAMatriz(texto[i * 16:i * 16 + 16])
        t = traspuestaMatriz(t)
        
        for i in range(len(t)):
            t[i] = shiftFila(t[i], i)
            
        t = traspuestaMatriz(t)
        
        for row in t:
            for e in row:
                shiftTexto.append(e)
                
    return shiftTexto


def mixColumns(texto, elementosClave):
    assert len(elementosClave) == 3, "Los elementos de la clave del tercer paso debe ser 3"
    elementosClave = hexToBinCuerpo(elementosClave)
    elementosClave.reverse()
    elementosClave.append(revAlph[15])
    
    matriz = [elementosClave[:]]
    for i in range(len(elementosClave) - 1):
        matriz.append(shiftFila(matriz[i], -1))
    mixTexto = []       
    for i in range(len(texto) // 16):
        t = listaAMatriz(texto[i * 16:i * 16 + 16])
        t = productoMatrices(t, matriz, 'cuerpo')
        for row in t:
            for e in row:
                mixTexto.append(e)
    
    return mixTexto


def sumarClave(texto, clave):
    clave = hexToBinCuerpo(clave)
    textoSuma = []
    for i in range(len(texto) // 16):
        for (t, c) in zip(texto[i * 16:i * 16 + 16], clave):
            textoSuma.append(suma(t, c))
    return textoSuma


def codificar(texto, clave):
    texto = hexToBinCuerpo(texto)  # #Texto en binario
    texto = subBytes(texto, clave[:5])  # #Paso 1
    texto = shiftRows(texto)  # #Paso 2
    texto = mixColumns(texto, clave[10:13])  # #Paso 3
    texto = sumarClave(texto, clave)  # #Paso 4
    texto = subBytes(texto, clave[5:10])  # #Paso 5
    texto = shiftRows(texto)  # #Paso 6
    texto = mixColumns(texto, clave[13:])  # #Paso 7
    return binCuerpoToHex(texto)


if __name__ == "__main__":
    
    # #Clave a usar
    while (True):
        try:
            clave = input("Introduce la clave en hexadecimal (ej: 0123456789abcdef): ")
            assert comprobarClave(clave), "Clave no valida"
            break
        except Exception as e:
            print("Introduzca de nuevo la clave: " + str(e))
    
    # #Texto a codificar
    while(True):
        try:
            rutaTexto = input("Introduce el fichero que contiene el texto (ej: texto.txt): ")
            texto = leerTexto(rutaTexto)
            assert comprobarTexto(texto), "Texto no válido"
            break
        except Exception as e:
            print("Introduzca de nuevo la ruta: " + str(e))
        
    codigo = codificar(texto, clave)
    print("Texto a codificar: " + texto)
    print("Texto codificado: " + codigo)
    
    # #Fichero a escribir
    while(True):
        try:
            rutaCodigo = input("Introduce el fichero para escribir el codigo (ej: codigo.txt): ")
            escribirCodigo(rutaCodigo, codigo)
            break
        except Exception as e:
            print("Introduzca de nuevo la ruta; " + str(e))
