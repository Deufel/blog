@rt("/register")
def get():
    return Div(cls="card centered elevated")(
        Style("""
            me {
                margin: var(--size-5) auto 0 auto;
                border-radius: var(--radius-conditional-2);
                width: min(100%, var(--size-content-3));
                @media (width < 768px) {
                    margin: 0;
                    inset: 0;
                    min-height: 100svh;
                    width:100%
                }
            }
            me {
                position: relative;
                &.centered {
                    & > hgroup { display: flex; flex-direction: column; align-items: center; text-align: center; }
                    & > .actions { justify-content: center; }
                }
                & > .close-button {
                    position: absolute;
                    right: var(--size-3);
                    top: var(--size-3);
                }
            }
        """),
        Button(cls="icon-button close-button", aria_label="Close", hx_get="/", hx_target="body")(icon("cancel")),
        Hgroup(cls="")(
            P(icon("logo")),
            H2("Create Account"),
            P("Get started today")
        ),
        Div(cls="content")(
            Form(
                Button(type="button", cls="button outlined margin")(icon("G"), "Sign up with Google"),
                Divider("or"),
                Div(cls="form-row")(
                    Label(cls="field filled")(
                        Span("First Name", cls="label"),
                        Input(type="text", id="first_name", name="first_name", required="true", placeholder=" "),
                        Span(cls="supporting-text")(" ")
                    ),
                    Label(cls="field filled")(
                        Span("Last Name", cls="label"),
                        Input(type="text", id="last_name", name="last_name", required="true", placeholder=" "),
                        Span(cls="supporting-text")(" ")
                    )
                ),
                Label(cls="field filled")(
                    Span("Email", cls="label"),
                    Input(type="email", id="email", name="email", required="true", placeholder=" "),
                    Span(cls="supporting-text")(" ")
                ),
                Div(cls="form-row")(
                    Label(cls="field filled")(
                        Span("Company", cls="label"),
                        Input(type="text", id="company", name="company", required="true", placeholder=" "),
                        Span(cls="supporting-text")(" ")
                    ),
                    Label(cls="field filled")(
                        Span("Industry", cls="label"),
                        Input(type="text", id="industry", name="industry", placeholder=" ", list="datalist_id"),
                        Datalist(id="datalist_id")(
                            Option(value="Distribution"),
                            Option(value="Beverage manufacturer"),
                            Option(value="Marketing"),
                            Option(value="Regulatory")
                        ),
                        Span(cls="supporting-text")(" ")
                    )
                ),
                Div(cls="field filled")(
                    Input(type="password", id="password", name="password", required="true", placeholder=" "),
                    Label("Password", fr="password", cls="label"),
                    Span("Must be at least 8 characters", cls="supporting-text")
                ),
                Label(cls="checkbox")(
                    Input(type="checkbox", name="terms", required=""),
                    Span(cls="label")(
                        "I agree to the ",
                        A("Terms of Service", href="/terms", cls="link"),
                        " and ",
                        A("Privacy Policy", href="/privacy", cls="link")
                    )
                ),
                Button(icon("user_plus"), "Create Account", type="submit", cls="button filled margin", hx_post="/register", hx_target="body"),
                Div(cls="flex-center")(
                    P(cls="text-sm")(
                        "Already have an account?",
                        A("Sign in", href="/signin", cls="link")
                    )
                )
            )
        )
    )
