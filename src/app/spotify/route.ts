import {NextRequest, NextResponse} from "next/server";

export function GET(_request: NextRequest) {
    return NextResponse.json({
        ok: true,
        msg: "hi"
    })
}
