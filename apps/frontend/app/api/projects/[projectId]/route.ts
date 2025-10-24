import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProjectByIdWithStats } from "@/lib/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;
    const project = await getProjectByIdWithStats(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;
    const formData = await request.formData();

    // Forward the request to the backend
    const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/update-project/${projectId}`;

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
