# Excedentes solares: ¿compensar o minar?

Calculadora gratuita que compara lo que se cobra por compensar el excedente fotovoltaico con el valor esperado de usar ese excedente en un minero de Bitcoin que solo funciona mientras sobra energía.

**En línea:** https://mineshop007.github.io/excedentes-solares-mineria/

## Método

- Energía usada (kWh/día) = mín(excedente diario, potencia del equipo × horas con excedente)
- Bloques esperados al día = 144 × (hashrate del equipo ÷ hashrate de la red) × (horas de minado ÷ 24)
- Valor esperado = bloques × recompensa media por bloque × (1 − comisión del pool) × precio de BTC
- Se compara con: energía usada × precio de compensación

Valor esperado, no garantizado. No incluye el coste del equipo, impuestos ni cambios de dificultad. Supuestos de red editables (1 de octubre de 2026, mempool.space).

## Tests

```
node test.js
```

## Sobre el proyecto

Ofrecida por [Mineshop.eu](https://mineshop.eu/es), tienda que vende los equipos incluidos: [mini mineros de Bitcoin](https://mineshop.eu/es/mini-bitcoin-miners), [calculadora de minería en solitario](https://mineshop.eu/es/bitcoin-solo-mining-calculator) y [calculadora de reutilización de calor](https://mineshop.eu/es/heat-reuse-calculator). Sin cookies ni analítica.
