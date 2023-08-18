/// Core module.
mod core {
    mod lockup_linear;
}

/// Module containing types for the system.
mod types {
    mod lockup;
    mod lockup_linear;
}

/// Module containing tokens implementations.
/// TODO: remove and use OpenZeppelin dependency when it's ready.
mod tokens {
    mod erc20;
    mod erc721;
}
