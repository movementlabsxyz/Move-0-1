
First, install `Movement` as described in [the README.md file](../README.md).
With Movment installed, create and fund an account on devnet with

    movement init

Compile the script

    movement move compile --named-addresses hello_blockchain=default

First deployment

    movement move publish --named-addresses hello_blockchain=default


